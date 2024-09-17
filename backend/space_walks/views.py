from django.shortcuts import render
from .models import SpaceWalks
from rest_framework import viewsets
from .models import SpaceWalks
from .serializers import SpaceWalksSerializer

def list_items(request):
    items = SpaceWalks.objects.all()
    return render(request, 'space_walks/list.html', {'items': items})

class SpaceWalksViewSet(viewsets.ModelViewSet):
    queryset = SpaceWalks.objects.all()
    serializer_class = SpaceWalksSerializer
