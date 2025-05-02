from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()
# user registration
class UserRegistrationView(APIView):
    permission_classes = [AllowAny] 
    def post(self,request):
        print(request.data)
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
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = request.data.get('email')
            password = request.data.get('password')
            user = authenticate(email=email, password=password)
            if user is None:
                return Response(
                    {"detail": "Invalid email or password."},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            refresh = RefreshToken.for_user(user)
            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)