from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from decouple import config
from django_daraja.mpesa.core import MpesaClient
import json
import logging
from payments.models import Payment,User

logger = logging.getLogger(__name__)

class STKPushAPIView(APIView):
    def post(self,request):
        phone_number = request.data.get("phone_number")
        amount = request.data.get("amount")
        
        if not phone_number or not amount:
            return Response({
                "error": "Phone number and amount are required."
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if not phone_number.startswith("254") or len(phone_number) !=12:
            return Response({
                "error": "Phone number must be in format 2547XXXXXXXX"
            },status=status.HTTP_400_BAD_REQUEST)
        
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
                "Captive portal access",
                callback_url
            )
            logger.info("STK Push Response: %s", response)  # Log response
            return Response(response,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error":str(e)
            },status.HTTP_500_INTERNAL_SERVER_ERROR)

# callback view to handle mpesa responses
@csrf_exempt
def mpesa_callback(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.info("MPESA Callback received: %s", data)
            
            # extract relevant data from mpesa callback
            stk_callback = data.get('Body', {}).get('stkCallback', {})
            result_code = stk_callback.get('ResultCode')
            result_desc = stk_callback.get('ResultDesc')
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
            transaction_date = get_value('TransactionDate')
            
            # check if all necessary data is available
            if not amount or not phone_number or not mpesa_receipt or not transaction_date:
                return JsonResponse({"error": "Missing required data"}, status=400)
            
            # initialize mpesaclient for payment verification
            mpesa_client = MpesaClient()
            payment_status = mpesa_client.payment_status(mpesa_receipt)
            
            # ensure the user can't tamper with the amount
            if payment_status['ResultCode'] == 0:
                actual_amount = payment_status['CallbackMetadata']['Item'][0]['Value']
                if actual_amount !=float(amount):
                    return JsonResponse({"error": "Amount mismatch. Payment is invalid."}, status=400)
            else:
                return JsonResponse({"error": "Failed to verify payment with M-Pesa."}, status=400)
                
            # link payments to the user,create one if doesn't exist
            user,created = User.objects.get_or_create(phone_number=phone_number)
            access_duration = calculate_access_time(actual_amount)
            
            # save payment data to database
            payment = Payment.objects.create(
                phone_number=phone_number,
                amount=amount,
                mpesa_receipt=mpesa_receipt,
                transaction_date=transaction_date,
                status='Success' if result_code == 0 else 'Failed',
                transaction_type='STK Push',
                reference='captive portal', # i might ref something else
                access_duration_minutes=access_duration,
                start_time=transaction_date
            )
            logger.info("Payment successfully saved: %s",payment)
            return JsonResponse({"message": "Callback received successfully"}, status=200)
        
        except Exception as e:
            logger.error("Error in MPESA callback: %s", str(e))
            return JsonResponse({"error": "Invalid data"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

def calculate_access_time(amount):
    '''return 30 == 30 minutes'''
    if amount >= 10:
        return 30
    elif amount >= 20:
        return 60
    elif amount >= 50:
        return 120
    else:
        return 15