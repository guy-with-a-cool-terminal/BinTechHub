from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('password_manager.urls')),
     # MPESA integration URLs
    path('api/mpesa/', include('mpesa_integration.urls')),
    # user registration and auth url
    path('api/onboarding/',include('custom_authentication.urls')),
    ]
