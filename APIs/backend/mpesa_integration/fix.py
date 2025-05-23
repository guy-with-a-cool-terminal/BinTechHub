def post(self, request):
    phone_number = request.data.get("phone_number")
    amount = request.data.get("amount")
    service_type = request.data.get("service_type", "generic")

    if not phone_number or not amount:
        return Response({"error": "Phone number and amount are required."}, status=status.HTTP_400_BAD_REQUEST)

    if not phone_number.startswith("254") or len(phone_number) != 12:
        return Response({"error": "Phone number must be in format 2547XXXXXXXX"}, status=status.HTTP_400_BAD_REQUEST)

    def safe_get(obj, *keys):
        keys_lower = [k.lower() for k in keys]
        if isinstance(obj, dict):
            obj_lower = {k.lower(): v for k, v in obj.items()}
            for key in keys_lower:
                if key in obj_lower and obj_lower[key] is not None:
                    return obj_lower[key]
        else:
            for key in keys_lower:
                for attr in dir(obj):
                    if attr.lower() == key:
                        value = getattr(obj, attr, None)
                        if value is not None:
                            return value
        return None

    try:
        mpesa_consumer_key = config("MPESA_CONSUMER_KEY")
        mpesa_consumer_secret = config("MPESA_CONSUMER_SECRET")

        cl = MpesaClient()
        callback_url = config("MPESA_CALLBACK_URL")

        response = cl.stk_push(
            phone_number,
            amount,
            "CaptivePortal",
            "Payment Service",
            callback_url
        )
        logger.info("STK Push Response: %s", response)

        if isinstance(response, str):
            try:
                response = json.loads(response)
            except json.JSONDecodeError:
                response = {"message": response}

        checkout_request_id = safe_get(response, "CheckoutRequestID", "ResponseCode")

        if checkout_request_id is None:
            logger.warning(f"Could not find CheckoutRequestID or ResponseCode in response: {response}")

        return Response({
            "CheckoutRequestID": checkout_request_id,
            "response": response
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error("STK Push Error: %s", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
