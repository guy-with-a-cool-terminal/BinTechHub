from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from django.utils.decorators import method_decorator
from django.db import models
import json
import logging
import requests
from datetime import datetime
from base64 import b64encode

logger = logging.getLogger(__name__)

# ===========================
# MODELS
# ===========================

class Customer(models.Model):
    phone_number = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.phone_number


class MpesaCredential(models.Model):
    shortcode = models.CharField(max_length=20, unique=True)
    consumer_key = models.CharField(max_length=100)
    consumer_secret = models.CharField(max_length=100)
    passkey = models.CharField(max_length=100)
    environment = models.CharField(max_length=10, choices=[("sandbox", "Sandbox"), ("production", "Production")])

    def __str__(self):
        return f"{self.shortcode} ({self.environment})"


class Payment(models.Model):
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    transaction_type = models.CharField(max_length=50)
    checkout_request_id = models.CharField(max_length=100, unique=True)
    mpesa_receipt = models.CharField(max_length=50, null=True, blank=True)
    transaction_date = models.DateTimeField(null=True, blank=True)
    reference = models.CharField(max_length=100)
    service_type = models.CharField(max_length=50)
    access_duration_minutes = models.IntegerField(null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)
    shortcode = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"{self.phone_number} - {self.amount} - {self.status}"


# ===========================
# DYNAMIC MPESA CLIENT
# ===========================

class DynamicMpesaClient:
    def __init__(self, consumer_key, consumer_secret, passkey, shortcode, environment):
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.passkey = passkey
        self.shortcode = shortcode
        self.environment = environment

        self.base_url = (
            "https://sandbox.safaricom.co.ke"
            if self.environment == "sandbox"
            else "https://api.safaricom.co.ke"
        )
        self.access_token = self._get_access_token()

    def _get_access_token(self):
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(url, auth=(self.consumer_key, self.consumer_secret))
        if response.status_code == 200:
            return response.json().get("access_token")
        raise Exception("Unable to fetch access token from M-Pesa.")

    def stk_push(self, phone_number, amount, account_reference, transaction_desc, callback_url):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = self.shortcode + self.passkey + timestamp
        encoded_password = b64encode(password.encode()).decode()

        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        headers = {"Authorization": f"Bearer {self.access_token}"}
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": encoded_password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc,
        }

        response = requests.post(url, json=payload, headers=headers)
        return response.json()

    def payment_status(self, receipt_number):
        return {
            "ResultCode": 0,
            "CallbackMetadata": {
                "Item": [
                    {"Name": "Amount", "Value": 100},
                    {"Name": "MpesaReceiptNumber", "Value": receipt_number},
                ]
            }
        }


# ===========================
# VIEWS
# ===========================

class STKPushAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone_number = request.data.get("phone_number")
        amount = request.data.get("amount")
        shortcode = request.data.get("shortcode")
        service_type = request.data.get("service_type", "generic")

        if not all([phone_number, amount, shortcode]):
            return Response({"error": "phone_number, amount, and shortcode are required."}, status=400)

        if not phone_number.startswith("254") or len(phone_number) != 12:
            return Response({"error": "Phone number must be in format 2547XXXXXXXX"}, status=400)

        try:
            creds = MpesaCredential.objects.get(shortcode=shortcode)

            cl = DynamicMpesaClient(
                consumer_key=creds.consumer_key,
                consumer_secret=creds.consumer_secret,
                passkey=creds.passkey,
                shortcode=creds.shortcode,
                environment=creds.environment,
            )

            callback_url = "https://yourdomain.com/api/mpesa/callback/"
            response_data = cl.stk_push(
                phone_number,
                amount,
                "Avalinc",
                "Payment Service",
                callback_url
            )

            checkout_request_id = response_data.get("CheckoutRequestID")
            if not checkout_request_id:
                return Response({"error": "Missing CheckoutRequestID in STK push response", "response": response_data}, status=500)

            Payment.objects.create(
                phone_number=phone_number,
                amount=amount,
                status="Pending",
                transaction_type="STK Push",
                checkout_request_id=checkout_request_id,
                reference="STK Request",
                service_type=service_type,
                shortcode=shortcode
            )

            return Response({"CheckoutRequestID": checkout_request_id, "response": response_data}, status=200)

        except MpesaCredential.DoesNotExist:
            return Response({"error": "Invalid shortcode or credentials not found."}, status=404)
        except Exception as e:
            logger.error("STK Push Error: %s", str(e))
            return Response({"error": str(e)}, status=500)


@csrf_exempt
def mpesa_callback(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        stk_callback = data.get('Body', {}).get('stkCallback', {})
        result_code = stk_callback.get('ResultCode')
        checkout_id = stk_callback.get("CheckoutRequestID")
        metadata = stk_callback.get('CallbackMetadata', {})
        items = metadata.get('Item', [])

        def get_value(items_list, name):
            for item in items_list:
                if item['Name'] == name:
                    return item.get('Value')
            return None

        amount = get_value(items, 'Amount')
        mpesa_receipt = get_value(items, 'MpesaReceiptNumber')
        phone_number = get_value(items, 'PhoneNumber')
        transaction_date_raw = get_value(items, 'TransactionDate')

        if not all([amount, phone_number, mpesa_receipt, transaction_date_raw]):
            return JsonResponse({"error": "Missing required data"}, status=400)

        transaction_date_str = str(transaction_date_raw)
        transaction_datetime = parse_datetime(
            f"{transaction_date_str[:4]}-{transaction_date_str[4:6]}-{transaction_date_str[6:8]}T"
            f"{transaction_date_str[8:10]}:{transaction_date_str[10:12]}:{transaction_date_str[12:14]}"
        )

        payment = Payment.objects.get(checkout_request_id=checkout_id)
        creds = MpesaCredential.objects.get(shortcode=payment.shortcode)

        mpesa_client = DynamicMpesaClient(
            consumer_key=creds.consumer_key,
            consumer_secret=creds.consumer_secret,
            passkey=creds.passkey,
            shortcode=creds.shortcode,
            environment=creds.environment
        )

        payment_status_response = mpesa_client.payment_status(mpesa_receipt)
        if payment_status_response['ResultCode'] != 0:
            return JsonResponse({"error": "Failed to verify payment with M-Pesa."}, status=400)

        items_verified = payment_status_response.get("CallbackMetadata", {}).get("Item", [])
        actual_amount = get_value(items_verified, 'Amount')

        if float(actual_amount) != float(amount):
            return JsonResponse({"error": "Amount mismatch. Payment is invalid."}, status=400)

        customer, _ = Customer.objects.get_or_create(phone_number=phone_number)

        payment.mpesa_receipt = mpesa_receipt
        payment.status = "Success" if result_code == 0 else "Failed"
        payment.transaction_date = transaction_datetime
        payment.customer = customer
        payment.phone_number = phone_number
        payment.amount = amount

        if payment.service_type == "captive_portal" and result_code == 0:
            payment.access_duration_minutes = calculate_access_time(float(amount))
            payment.start_time = transaction_datetime

        payment.save()
        return JsonResponse({"message": "Callback processed successfully"}, status=200)

    except Exception as e:
        logger.error("Error in MPESA callback: %s", str(e))
        return JsonResponse({"error": "Invalid data or processing error"}, status=400)


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


def calculate_access_time(amount):
    if amount >= 50:
        return 120
    elif amount >= 20:
        return 60
    elif amount >= 10:
        return 30
    else:
        return 15
