from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import PasswordEntry

User = get_user_model()

# User registration serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # ✅ Proper Django password hashing
        user.save()
        return user

# Login serializer
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Let views.py handle authentication via `authenticate()`
        return data

# password entry serializer
class PasswordEntrySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # exclude encrypted password from being accessed via API
    class Meta:
        model = PasswordEntry
        fields = ['id', 'user', 'title', 'website', 'username', 'encrypted_password','password','created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
        
        # Encrypt the password before saving
    def create(self, validated_data):
        password = validated_data.pop('password')
        
        # Encrypt the password before saving
        password_entry = PasswordEntry(**validated_data)
        password_entry.set_password(password)  # Use custom encryption method
        password_entry.save()
        
        return password_entry

    # Override the update method to handle re-encryption
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        # Re-encrypt the password if it was updated
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)

    # Add a method to return decrypted password
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Decrypt password before sending to the user
        representation['password_status'] = 'Password is encrypted and secure'
        # Remove the encrypted password from the response for security reasons
        del representation['encrypted_password']
        return representation

