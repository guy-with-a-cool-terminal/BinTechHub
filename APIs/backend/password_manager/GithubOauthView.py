from urllib.parse import urlencode
import secrets
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny  # remove allowany
from rest_framework import status
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import redirect

class GitHubThrottle(UserRateThrottle):
    rate = '3/min'
    
class GitHubView(APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]   # remove this after tests
    throttle_classes = [GitHubThrottle]
    def get(self,request):
        code = request.GET.get('code')
        if not code:
            # csrf protection
            oauth_state = secrets.token_urlsafe(16)
            request.session['github_oauth_state'] = oauth_state
            # redirect user to github oauth page
            params = {
                'client_id': settings.GITHUB_CLIENT_ID,
                'scope': 'repo:read'
            }
            url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
            return redirect(url)
        try:
            # callback...exchange code for access token
            token_response = requests.post(
                "https://github.com/login/oauth/access_token",
                data={
                    'client_id': settings.GITHUB_CLIENT_ID,
                    'client_secret': settings.GITHUB_CLIENT_SECRET,
                    'code': code
                },
                headers={'Accept': 'application/json'},
                timeout=10  # prevent hanging requests
            )
            token_response.raise_for_status()
        except requests.RequestException as e:
            return Response({'error': 'GitHub token request failed.', 'details': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        token_json = token_response.json()
        access_token = token_json.get('access_token')
        
        if not access_token:
            return Response({'error': 'Failed to get access token'}, status=status.HTTP_400_BAD_REQUEST)
        
        # TODO: Save access_token to user profile here
        
        return Response({'access_token': access_token})