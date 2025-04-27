from django_daraja.mpesa.core import MpesaClient
import json
from django.http import JsonResponse
from payments.models import Payment, User
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def mpesa_callback(request):
    if request.method == 'POST':
        try:
            # Parse the incoming callback data
            data = json.loads(request.body)
            logger.info("MPESA Callback received: %s", data)
            
            # Extract the relevant data from the callback
            stk_callback = data.get('Body', {}).get('stkCallback', {})
            result_code = stk_callback.get('ResultCode')
            result_desc = stk_callback.get('ResultDesc')
            metadata = stk_callback.get('CallbackMetadata', {})
            items = metadata.get('Item', [])
            
            # Helper function to extract values by name
            def get_value(name):
                for item in items:
                    if item['Name'] == name:
                        return item.get('Value')
                return None
            
            amount = get_value('Amount')
            mpesa_receipt = get_value('MpesaReceiptNumber')
            phone_number = get_value('PhoneNumber')
            transaction_date = get_value('TransactionDate')
            
            # Check if all necessary data is available
            if not amount or not phone_number or not mpesa_receipt or not transaction_date:
                return JsonResponse({"error": "Missing required data"}, status=400)

            # Initialize MpesaClient to verify payment with M-Pesa
            mpesa_client = MpesaClient()
            payment_status = mpesa_client.payment_status(mpesa_receipt)

            # Verify the actual amount from M-Pesa (this step ensures the user cannot tamper with the amount)
            if payment_status['ResultCode'] == 0:
                # Actual amount paid, as verified by M-Pesa
                actual_amount = payment_status['CallbackMetadata']['Item'][0]['Value']
                if actual_amount != float(amount):
                    return JsonResponse({"error": "Amount mismatch. Payment is invalid."}, status=400)
            else:
                return JsonResponse({"error": "Failed to verify payment with M-Pesa."}, status=400)

            # Link the payment to the user, create a new user if one doesn't exist
            user, created = User.objects.get_or_create(phone_number=phone_number)
            
            # Calculate access time based on the actual verified amount
            access_duration = calculate_access_time(actual_amount)  # Use the verified amount

            # Save the payment to the database
            payment = Payment.objects.create(
                phone_number=phone_number,
                amount=actual_amount,
                mpesa_receipt=mpesa_receipt,
                transaction_date=transaction_date,
                status='Success' if result_code == 0 else 'Failed',
                transaction_type='STK Push',
                reference='Captive portal',  # Can be adjusted as needed
                access_duration_minutes=access_duration,
                start_time=transaction_date
            )
            
            logger.info("Payment successfully saved: %s", payment)
            return JsonResponse({"message": "Callback received successfully", "payment": payment.id}, status=200)
        
        except Exception as e:
            logger.error("Error in MPESA callback: %s", str(e))
            return JsonResponse({"error": "Invalid data"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

def calculate_access_time(amount):
    '''Returns access time based on the amount'''
    if amount >= 10:
        return 30  # 10 KSh = 30 minutes
    elif amount >= 20:
        return 60  # 20 KSh = 1 hour
    elif amount >= 50:
        return 120  # 50 KSh = 2 hours
    else:
        return 15  # Default time for smaller payments
