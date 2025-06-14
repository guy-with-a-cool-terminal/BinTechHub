from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class DarajaCredential(models.Model):
    ENVIRONMENT_CHOICES = (
        ('sandbox', 'Sandbox'),
        ('production', 'Production'),
    )

    SERVICE_USAGE_CHOICES = (
        ('generic', 'Generic'),
        ('ecommerce', 'E-commerce'),
        ('captive_portal', 'Captive Portal'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daraja_credentials')
    consumerKey = models.CharField(max_length=255)
    consumerSecret = models.CharField(max_length=255)
    shortcode = models.CharField(max_length=20)
    passkey = models.CharField(max_length=255)
    environment = models.CharField(max_length=20, choices=ENVIRONMENT_CHOICES)
    usage_type = models.CharField(max_length=30, choices=SERVICE_USAGE_CHOICES, default='generic')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.environment} - {self.usage_type}"
