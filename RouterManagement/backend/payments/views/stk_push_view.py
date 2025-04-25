from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from decouple import config
from django_daraja.mpesa.core import MpesaClient
import json
import logging
from payments.models import Payment
from payments.mpesa_integration.auth import generate_oauth_token

logger = logging.getLogger(__name__)

class STKPushAPIView(APIView):
    def post(self,request):
        phone_number = request.data.get("phone_number")
        amount = request.data.get("amount")
        
        if not phone_number or not amount:
            return Response({
                "error": "Phone number and amount are required."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # generate Oauth token
        try:
            token = generate_oauth_token()
        except Exception as e:
            return Response({
                "error": f"Error generating token: {str(e)}"
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # initialize mpesa client
        cl = MpesaClient()
        callback_url = config("MPESA_CALLBACK_URL")
        
        try:
            # call stk_push
            response = cl.stk_push(
                phone_number,
                amount,
                "CaptivePortal", #account ref
                callback_url,
                "Captive portal access"
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
            stk_callback = data.get('Body',{}).get('stkCallback',{})
            
            result_code = stk_callback.get('ResultCode')
            result_desc = stk_callback.get('ResultDesc')
            metadata = stk_callback.get('CallbackMetadata',{})
            
            # collecting transaction details
            transaction_date = stk_callback.get('TransactionDate')
            mpesa_receipt = stk_callback.get('MpesaReceiptNumber')
            phone_number = stk_callback.get('PhoneNumber') 
            amount = metadata.get('Item', [{}])[0].get('Value')
            
            # save payment data to database
            payment = Payment.objects.create(
                phone_number=phone_number,
                amount=amount,
                mpesa_receipt=mpesa_receipt,
                transaction_date=transaction_date,
                status='Success' if result_code == 0 else 'Failed',
                transaction_type='STK Push',
                reference='pay for your drugs' # i might ref something else
            )
            logger.info("Payment successfully saved: %s",payment)
            return JsonResponse({"message": "Callback received successfully"}, status=200)
        
        except Exception as e:
            logger.error("Error in MPESA callback: %s", str(e))
            return JsonResponse({"error": "Invalid data"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)