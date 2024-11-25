from rest_framework import serializers
from .models import TaxTechApp, TaxData, Company

class TaxTechAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxTechApp
        fields = '__all__'


class TaxDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxData
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'