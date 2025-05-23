from django.urls import path
from .mpesa_views.stk_push_view import STKPushAPIView, mpesa_callback, PaymentStatusView

urlpatterns = [
    path('stkpush/', STKPushAPIView.as_view(), name='stkpush'),
    path('callback/', mpesa_callback, name='mpesa-callback'),
    path('status/', PaymentStatusView.as_view(), name='payment-status'),
]
