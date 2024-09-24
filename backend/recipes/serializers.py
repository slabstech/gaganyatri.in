from rest_framework import serializers
from .models import MyModel

'''
class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = ['title', 'description']
'''

class MyModelSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(max_length=1000)

    class Meta:
        model = MyModel
        fields = ['title', 'description']
