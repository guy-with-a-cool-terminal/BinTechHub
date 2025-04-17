from django.http import JsonResponse
from payments.mpesa_integration.auth import generate_oauth_token

def mpesa_token_view(request):
     """
    This view generates the OAuth token needed to authenticate MPesa API requests.
    It triggers the `generate_oauth_token()` function and returns the token as JSON.
    """
    try:
        token = generate_oauth_token()
        return JsonResponse(("access_token":token),status=200)
    except Exception as e:
        return JsonResponse({"error":str(e)},status=400)