from django.urls import path
from .views import *  # Importing everything from views
from .GithubOauthView import GitHubView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # User Authentication URLs
    path('signup/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token
    
    # Password Management URLs
    path('passwords/', PasswordEntryListView.as_view(), name='password-list'),  # List all passwords
    path('passwords/create/', PasswordEntryCreateView.as_view(), name='password-create'),  # Create new password
    path('passwords/<int:pk>/', PasswordEntryRetrieveView.as_view(), name='password-retrieve'),  # Retrieve specific password
    path('passwords/<int:pk>/update/', PasswordEntryUpdateView.as_view(), name='password-update'),  # Update password
    path('passwords/<int:pk>/delete/', PasswordEntryDeleteView.as_view(), name='password-delete'),  # Delete password
    
    # Github Oauth
    path('github/', GitHubView.as_view(), name='github-auth'),
]
