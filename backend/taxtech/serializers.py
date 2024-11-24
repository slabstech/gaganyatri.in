from rest_framework import serializers
from .models import TaxTechApp

class TaxTechAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxTechApp
        fields = '__all__'