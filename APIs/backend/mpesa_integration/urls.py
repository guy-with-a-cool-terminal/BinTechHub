from django.urls import path
from .mpesa_views.stk_push_view import STKPushAPIView,mpesa_callback
# from .mpesa_views.mpesa_token_view import mpesa_token_view # fallback if MPESACLIENT ever fails

urlpatterns = [
    path('stkpush/', STKPushAPIView.as_view(), name='stkpush'),
    path('callback/', mpesa_callback, name='mpesa-callback'),
    # path('mpesa/token/', mpesa_token_view, name="mpesa_token"),
]
