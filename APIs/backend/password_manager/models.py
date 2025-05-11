from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from cryptography.fernet import Fernet
import base64
import hashlib

from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.db import models

# Custom User Manager to handle user creation
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hash the password before saving
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)


# Custom User model extending AbstractBaseUser
class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)  # Unique email as the identifier
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # JWT token field (optional, as token info is typically stored in memory, not in the DB)
    refresh_token = models.CharField(max_length=255, blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  # Use email as the unique identifier
    REQUIRED_FIELDS = ['first_name', 'last_name']  # Fields required during superuser creation

    def __str__(self):
        return self.email

    # Permissions methods required by Django's admin
    def has_perm(self, perm, obj=None):
        """
        Returns True if the user has the specified permission, otherwise False.
        """
        if self.is_superuser:
            return True
        return self.user_permissions.filter(codename=perm).exists()

    def has_module_perms(self, app_label):
        """
        Returns True if the user has any permissions for the given app label, otherwise False.
        """
        if self.is_superuser:
            return True
        return self.user_permissions.filter(content_type__app_label=app_label).exists()

    def get_all_permissions(self, obj=None):
        """
        Returns a set of all permissions the user has.
        """
        if self.is_superuser:
            # Return all permissions if user is superuser
            return Permission.objects.all().values_list('codename', flat=True)
        return self.user_permissions.values_list('codename', flat=True)

    
'''Encryption and password management models'''

# AES helper function
def get_cipher():
    # derive 32-byte key
    key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    fernet_key = base64.urlsafe_b64encode(key)
    return Fernet(fernet_key)

# PasswordEntry model for storing encrypted passwords
class PasswordEntry(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    website = models.URLField(blank=True)
    username = models.CharField(max_length=255)
    encrypted_password = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'title')
        
    def set_password(self,raw_password):
        if len(raw_password) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        cipher = get_cipher()
        encrypted = cipher.encrypt(raw_password.encode())
        self.encrypted_password = encrypted.decode()
    
    def get_password(self):
        cipher = get_cipher()
        return cipher.decrypt(self.encrypted_password.encode()).decode()
    
    def __str__(self):
        return f"{self.title} ({self.username})"