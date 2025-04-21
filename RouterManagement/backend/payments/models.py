from django.db import models

class Payment(models.Model):
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    mpesa_receipt = models.CharField(max_length=50, unique=True)
    transaction_date = models.DateTimeField()
    status = models.CharField(max_length=50)
    transaction_type = models.CharField(max_length=50)
    reference = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Payment {self.mpesa_receipt} - {self.status}"
