from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('api/', include('password_manager.urls')),
    
    # MPESA integration URLs
    path('api/mpesa/', include('mpesa_integration.urls')),]
