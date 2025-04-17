from django.urls import path
from .views.mpesa_token_view import mpesa_token_view

urlpatterns = [
    path('mpesa/token/', mpesa_token_view, name="mpesa_token"),
]
