from django.shortcuts import render
from .models import SpaceWalks
from rest_framework import viewsets
from .models import SpaceWalks
from .serializers import SpaceWalksSerializer

from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import django_filters
from rest_framework import viewsets
from rest_framework.decorators import action

from datetime import datetime, timedelta
from rest_framework.response import Response
import requests
from datetime import datetime
from django.utils import timezone
from datetime import timedelta
from rest_framework.pagination import LimitOffsetPagination




def list_items(request):
    items = SpaceWalks.objects.all()
    return render(request, 'space_walks/list.html', {'items': items})

class SpaceWalksViewSet(viewsets.ModelViewSet):
    queryset = SpaceWalks.objects.all()
    serializer_class = SpaceWalksSerializer


    @action(detail=False, methods=['get'])
    def parseImage(self, request, *args, **kwargs):  
        json_data = {
            'name' : 'starmap',
      
        }
        # Update values


        return Response(json_data)
