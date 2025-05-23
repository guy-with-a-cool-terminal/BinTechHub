response = cl.stk_push(
    phone_number,
    amount,
    "CaptivePortal", # account ref
    "Payment Service",
    callback_url
)
logger.info("STK Push Response: %s", response)

checkout_id = getattr(response, "CheckoutRequestID", None)

Payment.objects.create(
    phone_number=phone_number,
    amount=amount,
    status="Pending",
    transaction_type="STK Push",
    reference="payment",
    checkout_request_id=checkout_id,
    service_type=service_type
)
return Response(response, status=status.HTTP_200_OK)
