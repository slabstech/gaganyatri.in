from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import django_filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from django.utils import timezone
from datetime import datetime, timedelta
import requests

from .models import TaxTechApp
from .serializers import TaxTechAppSerializer

from rest_framework.pagination import PageNumberPagination

class TaxTechAppPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class TaxTechAppViewSet(viewsets.ModelViewSet):
    queryset = TaxTechApp.objects.all().order_by('id')
    serializer_class = TaxTechAppSerializer
    pagination_class = TaxTechAppPagination

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .engine import execute_prompt, bundle_function, propose_recipes, compute_reduced_prices
import json

@api_view(['GET'])
def recipe_generate_route(request):
    isLocal = False
    try:
        json_objs = compute_reduced_prices()
        obj= json.loads(json_objs)
        bundle_articles = bundle_function(obj[:10])

        result = execute_prompt(propose_recipes(bundle_articles), False)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        return Response({'error': str(e)}, status=500)
    except Exception as e:
        print(f"An error occurred: {e}")
        return Response({'error': 'Something went wrong'}, status=500)
    return Response(result)
