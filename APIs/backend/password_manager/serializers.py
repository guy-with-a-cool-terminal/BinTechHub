from django.contrib.auth import get_user_model
from rest_framework import serializers
import bcrypt

User = get_user_model()

# user registration serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        
    def validate_password(self,value):
        # hash password before saving it
        hashed_password = bcrypt.hashpw(value.encode('utf-8'),bcrypt.gensalt())
        return hashed_password.decode('utf-8')
    
    def create(self,validated_data):
        # create new user instance after data validation
        user = User.objects.create(**validated_data)
        return user

# login serializer
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self,data):
        # check if user exists by email
        user = User.objects.filter(email=data['email']).first()
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        # Validate the password using bcrypt
        if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
            raise serializers.ValidationError("Invalid email or password")
        # return data if user==valid
        return data