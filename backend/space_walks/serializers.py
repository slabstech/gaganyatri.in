from rest_framework import serializers
from .models import SpaceWalks

class SpaceWalksSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceWalks
        fields = '__all__'
