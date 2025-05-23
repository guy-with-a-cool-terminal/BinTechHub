from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from decouple import config
from django_daraja.mpesa.core import MpesaClient
import json
import logging
from ..models import Payment,User

logger = logging.getLogger(__name__)

class STKPushAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        phone_number = request.data.get("phone_number")
        amount = request.data.get("amount")
        service_type = request.data.get("service_type", "generic") # captive portals,ecommerce etc
        
        if not phone_number or not amount:
            return Response({
                "error": "Phone number and amount are required."
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if not phone_number.startswith("254") or len(phone_number) !=12:
            return Response({
                "error": "Phone number must be in format 2547XXXXXXXX"
            },status=status.HTTP_400_BAD_REQUEST)
            
        def safe_get(obj, *keys):
            for key in keys:
                if isinstance(obj, dict):
                    value = obj.get(key)
                else:
                    value = getattr(obj, key, None)
                if value is not None:
                    return value
            return None
        
        try:
            # load credentials from .env
            mpesa_consumer_key = config("MPESA_CONSUMER_KEY")
            mpesa_consumer_secret = config("MPESA_CONSUMER_SECRET")
            
            # initialize mpesa client
            cl = MpesaClient()
            callback_url = config("MPESA_CALLBACK_URL")
            
            # call stk_push
            response = cl.stk_push(
                phone_number,
                amount,
                "CaptivePortal", #account ref
                "Payment Service",
                callback_url
            )
            logger.info("STK Push Response: %s", response)
            # ensure response is a serializable dictionary
            if isinstance(response, str):
                try:
                    response = json.loads(response)
                except json.JSONDecodeError:
                    response = {"message": response}         
            # Validate CheckoutRequestID
            checkout_request_id = response.get("CheckoutRequestID")
            if not checkout_request_id:
                logger.warning(f"Missing CheckoutRequestID in STK Push response: {response}")
                return Response({
                    "error": "Missing CheckoutRequestID in STK push response",
                    "raw_response": response
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                "CheckoutRequestID": checkout_request_id,
                "response": response
            }, status=status.HTTP_200_OK)              
        except Exception as e:
            logger.error("STK Push Error: %s", str(e))
            return Response({
                "error":str(e)
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# callback view to handle mpesa responses
@csrf_exempt
def mpesa_callback(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Invalid request method"}, status=405)
    try:
        data = json.loads(request.body)
        logger.info("MPESA Callback received: %s", data)
            
        # extract relevant data from mpesa callback
        stk_callback = data.get('Body', {}).get('stkCallback', {})
        result_code = stk_callback.get('ResultCode')
        checkout_id = stk_callback.get("CheckoutRequestID")
        metadata = stk_callback.get('CallbackMetadata',{})
        items = metadata.get('Item', [])
            
        # helper function to extract item values by name
        def get_value(name):
            for item in items:
                if item['Name'] == name:
                    return item.get('Value')
            return None
            
        amount = get_value('Amount')
        mpesa_receipt = get_value('MpesaReceiptNumber')
        phone_number = get_value('PhoneNumber')
        transaction_date_raw = get_value('TransactionDate')
            
        # check if all necessary data is available
        if not all([amount, phone_number, mpesa_receipt, transaction_date_raw]):
            return JsonResponse({"error": "Missing required data"}, status=400)
        
        # format transaction date
        transaction_date_str = str(transaction_date_raw)
        transaction_datetime = parse_datetime(
            f"{transaction_date_str[:4]}-{transaction_date_str[4:6]}-{transaction_date_str[6:8]}T"
            f"{transaction_date_str[8:10]}:{transaction_date_str[10:12]}:{transaction_date_str[12:14]}"
        )
            
        # initialize mpesaclient for payment verification
        mpesa_client = MpesaClient()
        payment_status_response = mpesa_client.payment_status(mpesa_receipt)
        if payment_status_response['ResultCode'] != 0:
            return JsonResponse({"error": "Failed to verify payment with M-Pesa."}, status=400)
        actual_amount = payment_status_response['CallbackMetadata']['Item'][0]['Value']

        # Prevent tampering by comparing callback amount to verification amount
        if float(actual_amount) != float(amount):
            return JsonResponse({"error": "Amount mismatch. Payment is invalid."}, status=400)
                        
        # link payments to the user,create one if doesn't exist
        user,created = User.objects.get_or_create(phone_number=phone_number)            
        # Find payment record by checkout_request_id or create if missing
        payment,created = Payment.objects.get_or_create(
            checkout_request_id=checkout_id,
            defaults={
                "phone_number": phone_number,
                "amount": amount,
                "transaction_date": transaction_datetime,
                "status": "Success" if result_code == 0 else "Failed",
                "transaction_type": "STK Push",
                "reference": "payment",
                "user": user,
                "service_type": "generic"  # fallback service_type
            }
        )
        # update payment if it already exists
        if not created:
            payment.mpesa_receipt = mpesa_receipt
            payment.status = "Success" if result_code == 0 else "Failed"
            payment.transaction_date = transaction_datetime
            payment.user = user
            payment.phone_number = phone_number
            payment.amount = amount
        # Apply captive portal duration logic ONLY if service_type is captive_portal
        if payment.service_type == "captive_portal":
            payment.access_duration_minutes = calculate_access_time(float(amount))
            payment.start_time = transaction_datetime
            
        payment.save()
        
        logger.info("Payment successfully saved: %s",payment)
        return JsonResponse({"message": "Callback processed successfully"}, status=200)
        
    except Exception as e:
        logger.error("Error in MPESA callback: %s", str(e))
        return JsonResponse({"error": "Invalid data or processing error"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

def calculate_access_time(amount):
    if amount >= 50:
        return 120
    elif amount >= 20:
        return 60
    elif amount >= 10:
        return 30
    else:
        return 15

class PaymentStatusView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        checkout_id = request.query_params.get('checkout_id')
        if not checkout_id:
            return Response({"error": "checkout_id is required"}, status=400)

        try:
            payment = Payment.objects.get(checkout_request_id=checkout_id)
            return Response({
                "status": payment.status,
                "service_type": payment.service_type,
                "access_duration_minutes": payment.access_duration_minutes if payment.service_type == "captive_portal" else None
            }, status=200)
        except Payment.DoesNotExist:
            return Response({"status": "Pending"}, status=200)

