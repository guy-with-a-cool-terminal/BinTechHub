from django.db import models

# user model, tracking users by phone  number
class User(models.Model):
    # phone number is unique and required
    phone_number = models.CharField(max_length=15,unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    # string representation returning phone number for easy display
    def __str__(self):
        return self.phone_number

# payment model to track payments
class Payment(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Success", "Success"),
        ("Failed", "Failed"),
    ]
    user = models.ForeignKey('User', on_delete=models.CASCADE, null=True, blank=True)
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    mpesa_receipt = models.CharField(max_length=50, unique=True,null=True, blank=True)
    transaction_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    transaction_type = models.CharField(max_length=50)
    reference = models.CharField(max_length=100, null=True, blank=True)
    checkout_request_id = models.CharField(max_length=100,unique=True,null=True,blank=True)
    access_duration_minutes = models.PositiveIntegerField(null=True,blank=True)
    start_time = models.DateTimeField(null=True,blank=True)
    service_type = models.CharField(max_length=50, null=True, blank=True)  # e.g., "captive_portal", "ecommerce"

    def __str__(self):
        return f"Payment {self.mpesa_receipt or self.checkout_request_id}  - {self.status}"

