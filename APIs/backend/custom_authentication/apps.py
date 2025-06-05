from django.apps import AppConfig


class CustomAuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'custom_authentication'
    
    def ready(self):
        from .FirebaseCore import firebase
