class STKPushAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone_number = request.data.get("phone_number")
        amount = request.data.get("amount")
        service_type = request.data.get("service_type", "generic")  # captive portals, ecommerce etc

        if not phone_number or not amount:
            return Response({
                "error": "Phone number and amount are required."
            }, status=status.HTTP_400_BAD_REQUEST)

        if not phone_number.startswith("254") or len(phone_number) != 12:
            return Response({
                "error": "Phone number must be in format 2547XXXXXXXX"
            }, status=status.HTTP_400_BAD_REQUEST)

        # helper to safely extract from dict or object
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
            # Load credentials
            mpesa_consumer_key = config("MPESA_CONSUMER_KEY")
            mpesa_consumer_secret = config("MPESA_CONSUMER_SECRET")

            # Initialize Mpesa client
            cl = MpesaClient()
            callback_url = config("MPESA_CALLBACK_URL")

            # Initiate STK Push
            raw_response = cl.stk_push(
                phone_number,
                amount,
                "CaptivePortal",  # account ref
                "Payment Service",
                callback_url
            )
            logger.info("Raw STK Push Response: %s", raw_response)

            # Convert MpesaResponse to dict
            response = getattr(raw_response, "response", None)

            if not isinstance(response, dict):
                logger.error("Unexpected response type from MpesaClient: %s", type(raw_response))
                return Response({
                    "error": "Unexpected response format from payment gateway.",
                    "raw_response": str(raw_response)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Use safe_get to fetch CheckoutRequestID or fallback
            checkout_request_id = safe_get(response, "CheckoutRequestID", "ResponseCode")

            if not checkout_request_id or "CheckoutRequestID" not in response:
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
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
