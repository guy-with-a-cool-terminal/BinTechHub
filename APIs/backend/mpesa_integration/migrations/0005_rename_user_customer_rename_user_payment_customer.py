# Generated by Django 5.2 on 2025-06-11 16:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mpesa_integration', '0004_alter_payment_transaction_date'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='User',
            new_name='Customer',
        ),
        migrations.RenameField(
            model_name='payment',
            old_name='user',
            new_name='customer',
        ),
    ]
