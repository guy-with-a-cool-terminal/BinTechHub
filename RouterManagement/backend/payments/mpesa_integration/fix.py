# stk_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from daraja.mpesa.core import MpesaClient
import json
import logging
from .models import Payment

logger = logging.getLogger(__name__)

class STKPushAPIView(APIView):
    def post(self, request):
        phone_number = request.data.get("phone_number")
        amount = request.data.get("amount")
        
        if not phone_number or not amount:
            return Response({
                "error": "Phone number and amount are required."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Initialize mpesa client
        cl = MpesaClient()
        callback_url = "https://yourdomain.com/api/mpesa/callback/"  # replace this with your real callback URL
        
        try:
            # Call stk_push
            response = cl.stk_push(
                phone_number,
                amount,
                "CaptivePortal",  # account ref
                callback_url,
                "Captive portal access"
            )
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Callback view to handle MPESA responses
@csrf_exempt
def mpesa_callback(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.info("MPESA Callback received: %s", data)

            # Extracting relevant data from MPESA callback
            stk_callback = data.get('Body', {}).get('stkCallback', {})

            result_code = stk_callback.get('ResultCode')
            result_desc = stk_callback.get('ResultDesc')
            metadata = stk_callback.get('CallbackMetadata', {})
            
            # Collecting transaction details
            transaction_date = stk_callback.get('TransactionDate')
            mpesa_receipt = stk_callback.get('MpesaReceiptNumber')
            phone_number = stk_callback.get('PhoneNumber')
            amount = metadata.get('Item', [{}])[0].get('Value')

            # Saving payment data to the database
            payment = Payment.objects.create(
                phone_number=phone_number,
                amount=amount,
                mpesa_receipt=mpesa_receipt,
                transaction_date=transaction_date,
                status='Success' if result_code == 0 else 'Failed',
                transaction_type='STK Push',
                reference='CaptivePortal'  # Or you could reference something else
            )

            logger.info("Payment successfully saved: %s", payment)

            return JsonResponse({"message": "Callback received successfully"}, status=200)

        except Exception as e:
            logger.error("Error in MPESA callback: %s", str(e))
            return JsonResponse({"error": "Invalid data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
