from urllib.parse import urlencode
import secrets
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from rest_framework.throttling import UserRateThrottle
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import redirect

class GitHubThrottle(UserRateThrottle):
    rate = '3/min'
    
class GitHubView(APIView):
    throttle_classes = [GitHubThrottle]
    
    def get_permissions(self):
        code = self.request.GET.get('code')
        if code:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get(self,request):
        code = request.GET.get('code')
        jwt_token = request.GET.get('token')
        # state = request.GET.get('state')
        if not code:
            # csrf protection
            oauth_state = secrets.token_urlsafe(16)
            request.session['github_oauth_state'] = oauth_state
            
            if jwt_token:
                request.session['user_jwt_token'] = jwt_token
            # redirect user to github oauth page
            params = {
                'client_id': settings.GITHUB_CLIENT_ID,
                'scope': 'repo:read'
                # 'state': oauth_state
            }
            url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
            return redirect(url)
        
        # validate state
        #  TODO fix the state bug
        # expected_state = request.session.get('github_oauth_state')
        # if not state or state != expected_state:
        #     return Response({'error': 'Invalid or missing state. Possible CSRF attack.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # authenticate the user using token param
        jwt_token = request.session.get('user_jwt_token', None)
        if jwt_token:
            jwt_auth = JWTAuthentication()
            try:
                validated_user, _ = jwt_auth.get_user(jwt_auth.get_validated_token(jwt_token)), None
                request.user = validated_user
            except Exception:
                return Response({'error': 'Invalid or expired JWT token.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

            
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # callback...exchange code for access token
            token_response = requests.post(
                "https://github.com/login/oauth/access_token",
                data={
                    'client_id': settings.GITHUB_CLIENT_ID,
                    'client_secret': settings.GITHUB_CLIENT_SECRET,
                    'code': code
                    # 'state': state
                },
                headers={'Accept': 'application/json'},
                timeout=10  # prevent hanging requests
            )
            token_response.raise_for_status()
        except requests.RequestException as e:
            return Response({'error': 'GitHub token request failed.', 'details': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        
        token_json = token_response.json()
        github_access_token = token_json.get('access_token')
        
        if not github_access_token:
            return Response({'error': 'Failed to get GitHub access token'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.github_access_token = github_access_token
        user.save(update_fields=['github_access_token'])
        
        # cleanup the state
        request.session.pop('github_oauth_state', None)
        
        return Response({'message': 'GitHub account connected successfully.'}, status=status.HTTP_200_OK)