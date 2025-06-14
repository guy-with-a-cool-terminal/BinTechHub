from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from firebase_admin import auth as firebase_auth
from django.contrib.auth import get_user_model

User = get_user_model()

# view handling login/signup
class FirebaseAuthenticationView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        id_token = request.data.get('firebase_token') # this is the name of the token we receive from firebase on the frontend
        print(id_token)
        if not id_token:
            return Response({"detail": "Firebase Token Missing!!"},status=status.HTTP_400_BAD_REQUEST)
        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            email = decoded_token.get('email')
            
            # save the created user
            user,created = User.objects.get_or_create(firebase_uid=uid, defaults={"email": email})
            if not created and user.email != email:
                user.email = email
                user.save()
            
            # return success and user info
            return Response({
                "message":"User is Authenticated",
                "uid":uid,
                "email":email,
                "created":created
            },status=status.HTTP_200_OK)
        except Exception as e:
            print("Firebase token verification error:", e)
            return Response({"detail": "Invalid token"},status=status.HTTP_401_UNAUTHORIZED)