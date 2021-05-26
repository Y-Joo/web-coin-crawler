from rest_framework import serializers
from .models import CoinData

class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinData
        fields = (
            'title',
            'content',
        )