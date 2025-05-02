from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer
from rest_framework_simplejwt.views import TokenRefreshView

# user registration
class UserRegistrationView(APIView):
    def post(self,request):
        # deserialize request data
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            # create user if data == valid
            user = serializer.save()
            return Response({"message": "User created successfully", "user_id": user.id}, status=status.HTTP_201_CREATED)
        # return error if data is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# user login
class UserLoginView(APIView):
    def post(self,request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            # if login is a success we generate a jwt..jawt whatever token
            try:
                user = User.objects.get(email=request.data['email'])
            except User.DoesNotExist:
                return Response({"detail": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Return the access token and refresh token
            return Response({
                "access_token": access_token,
                "refresh_token": refresh_token
            }, status=status.HTTP_200_OK)
            
        # If login is invalid, return an error
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)