from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FirebaseAuthenticationView
from .multiuseropsview import DarajaCredentialViewSet

router = DefaultRouter()
router.register(r'darajacreds', DarajaCredentialViewSet, basename='darajacreds')

urlpatterns = [
    path('userauth/', FirebaseAuthenticationView.as_view(), name='user-auth'),
    path('', include(router.urls)),
]
