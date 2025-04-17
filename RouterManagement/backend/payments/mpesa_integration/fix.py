from django.http import JsonResponse
from payments.mpesa_integration.auth import generate_oauth_token

# View to handle token generation
def mpesa_token_view(request):
    """
    This view generates the OAuth token needed to authenticate MPesa API requests.
    It triggers the `generate_oauth_token()` function and returns the token as JSON.
    """
    try:
        # Generate the OAuth token by calling the function
        token = generate_oauth_token()
        
        # Return the token in JSON response
        return JsonResponse({"access_token": token}, status=200)
    except Exception as e:
        # If there’s an error, return a failure message
        return JsonResponse({"error": str(e)}, status=400)
