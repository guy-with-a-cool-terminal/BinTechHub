from django.urls import path
from .views.mpesa_token_view import mpesa_token_view
from .views.stk_push_view import STKPushAPIView,mpesa_callback

urlpatterns = [
    path('mpesa/token/', mpesa_token_view, name="mpesa_token"),
    path('stk-push/', STKPushAPIView.as_view(), name='stk-push'),
    path('mpesa/callback/', mpesa_callback, name='mpesa-callback'),
]
