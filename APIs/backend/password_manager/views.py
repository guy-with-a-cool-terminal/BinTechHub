from rest_framework import status,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import PasswordEntry
from .serializers import PasswordEntrySerializer
from .serializers import UserRegistrationSerializer, UserLoginSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()
    
'''Password management views'''
# Pagination class
class PasswordEntryPagination(PageNumberPagination):
    page_size = 10  # Number of items per page
    page_size_query_param = 'page_size'  # Allow custom page size via query param
    max_page_size = 100  # Maximum page size
    # Optional: Customize page parameter if you want something like `page=1` instead of `page=1`
    page_query_param = 'page'
    
# create new password entry
class PasswordEntryCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        # Make sure the password is passed along with other data
        password = request.data.get('password', None)
        if not password:
            return Response({
                "detail": "Password is required."
            }, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = PasswordEntrySerializer(data=request.data)
        if serializer.is_valid():
            # add authenticated user to entry
            serializer.validated_data['user'] = request.user
            password_entry = serializer.save()
            return Response({
                "message": "Password entry created successfully",
                "password_entry_id": password_entry.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# list all password entries for authenticated user
class PasswordEntryListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = PasswordEntryPagination

    def get(self, request):
        # Filter the passwords by the authenticated user
        password_entries = PasswordEntry.objects.filter(user=request.user)
        paginator = PasswordEntryPagination()
        result_page = paginator.paginate_queryset(password_entries, request)
        if result_page is not None:
            serializer = PasswordEntrySerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        # If no pagination is needed (e.g., for small datasets), return the full list
        serializer = PasswordEntrySerializer(password_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# retrieve a single password entry
class PasswordEntryRetrieveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            # Get the specific password entry
            password_entry = PasswordEntry.objects.get(id=pk, user=request.user)
        except PasswordEntry.DoesNotExist:
            return Response({
                "detail": "Password entry not found."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = PasswordEntrySerializer(password_entry)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Update a password entry
class PasswordEntryUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            password_entry = PasswordEntry.objects.get(id=pk, user=request.user)
        except PasswordEntry.DoesNotExist:
            return Response({
                "detail": "Password entry not found."
            }, status=status.HTTP_404_NOT_FOUND)

        password = request.data.get('password', None)
        if password:
            password_entry.set_password(password)

        serializer = PasswordEntrySerializer(password_entry, data=request.data, partial=True)
        if serializer.is_valid():
            password_entry.save()
            return Response({
                "message": "Password entry updated successfully"
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete a password entry
class PasswordEntryDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            # Get the specific password entry
            password_entry = PasswordEntry.objects.get(id=pk, user=request.user)
        except PasswordEntry.DoesNotExist:
            return Response({
                "detail": "Password entry not found."
            }, status=status.HTTP_404_NOT_FOUND)

        password_entry.delete()
        return Response({
            "message": "Password entry deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)
