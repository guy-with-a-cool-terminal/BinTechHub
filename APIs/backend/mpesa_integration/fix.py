from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils.crypto import get_random_string
from django.conf import settings
from cryptography.fernet import Fernet
import base64
import os


class APIKey(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='api_key')
    key = models.CharField(max_length=40, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    revoked = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        super().save(*args, **kwargs)

    def generate_key(self):
        return get_random_string(40)

    def revoke(self):
        self.revoked = True
        self.save()

    def __str__(self):
        return f"APIKey(user={self.user.email}, revoked={self.revoked})"


class DarajaConfig(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='daraja_config')
    # Store encrypted keys
    encrypted_sandbox_key = models.TextField()
    encrypted_sandbox_secret = models.TextField()
    encrypted_live_key = models.TextField(null=True, blank=True)
    encrypted_live_secret = models.TextField(null=True, blank=True)
    use_sandbox = models.BooleanField(default=True)  # Default mode is sandbox
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_sandbox_credentials(self, key: str, secret: str):
        self.encrypted_sandbox_key = self._encrypt(key)
        self.encrypted_sandbox_secret = self._encrypt(secret)

    def set_live_credentials(self, key: str, secret: str):
        self.encrypted_live_key = self._encrypt(key)
        self.encrypted_live_secret = self._encrypt(secret)

    def get_sandbox_key(self):
        return self._decrypt(self.encrypted_sandbox_key)

    def get_sandbox_secret(self):
        return self._decrypt(self.encrypted_sandbox_secret)

    def get_live_key(self):
        if self.encrypted_live_key:
            return self._decrypt(self.encrypted_live_key)
        return None

    def get_live_secret(self):
        if self.encrypted_live_secret:
            return self._decrypt(self.encrypted_live_secret)
        return None

    def _get_cipher(self):
        # Use Django's SECRET_KEY as encryption key
        key = settings.SECRET_KEY
        if not key:
            raise ValueError("Missing SECRET_KEY in Django settings")
        # Prepare key for Fernet: 32 url-safe base64-encoded bytes
        key_bytes = base64.urlsafe_b64encode(key.encode()[:32].ljust(32, b"\0"))
        return Fernet(key_bytes)

    def _encrypt(self, plaintext: str) -> str:
        cipher = self._get_cipher()
        encrypted = cipher.encrypt(plaintext.encode())
        return encrypted.decode()

    def _decrypt(self, ciphertext: str) -> str:
        cipher = self._get_cipher()
        decrypted = cipher.decrypt(ciphertext.encode())
        return decrypted.decode()

    def __str__(self):
        return f"DarajaConfig(user={self.user.email}, sandbox={self.use_sandbox})"
