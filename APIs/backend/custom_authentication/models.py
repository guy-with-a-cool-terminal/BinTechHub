from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class DarajaCredential(models.Model):
    ENVIRONMENT_CHOICES = (
        ('sandbox', 'Sandbox'),
        ('production', 'Production'),
    )

    SERVICE_TYPE_CHOICES = (
        ('c2b', 'C2B'),
        ('b2c', 'B2C'),
        ('b2b', 'B2B'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daraja_credentials')
    consumerKey = models.CharField(max_length=255)
    consumerSecret = models.CharField(max_length=255)
    shortcode = models.CharField(max_length=20)
    passkey = models.CharField(max_length=255)
    environment = models.CharField(max_length=20, choices=ENVIRONMENT_CHOICES)
    serviceType = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.environment} - {self.serviceType}"
