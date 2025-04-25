class STKPushAPIView(APIView):
    def post(self, request):
        phone_number = request.data.get("phone_number")
        amount = request.data.get("amount")
        
        if not phone_number or not amount:
            return Response({
                "error": "Phone number and amount are required."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Enforce correct phone number format
        if not phone_number.startswith("254") or len(phone_number) != 12:
            return Response({
                "error": "Phone number must be in format 2547XXXXXXXX"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Initialize mpesa client and fetch callback URL from config
            cl = MpesaClient()
            callback_url = config("MPESA_CALLBACK_URL")  # Should pull from .env
            
            # Debugging print and log to confirm callback URL
            logger.debug("MPESA_CALLBACK_URL: %s", callback_url)
            print(f"MPESA_CALLBACK_URL: {callback_url}")

            # Make the STK Push request (correct parameter order)
            response = cl.stk_push(
                phone_number,
                amount,
                "CaptivePortal",  # Account reference
                "Captive portal access",  # Transaction description
                callback_url  # Callback URL
            )
            logger.info("STK Push Response: %s", response)  # Log response

            return Response(response, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
