from rest_framework import serializers
from .models import DarajaCredential

class DarajaCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = DarajaCredential
        fields = [
            'consumerKey',
            'consumerSecret',
            'shortcode',
            'passkey',
            'environment',
            'serviceType',
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        return DarajaCredential.objects.create(user=user, **validated_data)
