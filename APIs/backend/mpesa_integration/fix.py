def post(self, request):
    phone_number = request.data.get("phone_number")
    amount = request.data.get("amount")
    service_type = request.data.get("service_type", "generic")  # captive_portal, ecommerce, etc.
    print("Received service_type from frontend:", service_type)

    # ✅ Validate or fallback
    ALLOWED_SERVICE_TYPES = ["ecommerce", "captive_portal", "generic"]
    if service_type not in ALLOWED_SERVICE_TYPES:
        logger.warning(f"Unknown service_type '{service_type}' received. Defaulting to 'generic'.")
        service_type = "generic"

    ...
