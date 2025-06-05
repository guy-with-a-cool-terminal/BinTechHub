from django.urls import path
from .views import *

urlpatterns = [
    path('userauth/',FirebaseAuthenticationView.as_view(),name='user-auth'),
]