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

from .models import TaxTechApp, TaxData, Company
from .serializers import TaxTechAppSerializer, CompanySerializer, TaxDataSerializer

from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from mistralai import Mistral
import os
import requests
from openai import OpenAI
from ollama import Client
from django.http import FileResponse
import io
from rest_framework.pagination import PageNumberPagination

class TaxTechAppPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class TaxTechAppViewSet(viewsets.ModelViewSet):
    queryset = TaxTechApp.objects.all().order_by('id')
    serializer_class = TaxTechAppSerializer
    pagination_class = TaxTechAppPagination

class TaxDataPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class TaxDataViewSet(viewsets.ModelViewSet):
    queryset = TaxData.objects.all().order_by('id')
    serializer_class = TaxDataSerializer
    pagination_class = TaxDataPagination

class CompanyPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all().order_by('id')
    serializer_class = CompanySerializer
    pagination_class = CompanyPagination

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .engine import execute_prompt, bundle_function, propose_recipes, compute_reduced_prices
import json

@api_view(['GET'])
def recipe_generate_route(request):
    isLocal = False
    try:
        json_objs = compute_reduced_prices()
        obj = json.loads(json_objs)
        bundle_articles = bundle_function(obj[:10])
        result = execute_prompt(propose_recipes(bundle_articles), False)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        return Response({'error': str(e)}, status=500)
    except Exception as e:
        print(f"An error occurred: {e}")
        return Response({'error': 'Something went wrong'}, status=500)
    return Response(result)

class TaxLLMView(APIView):
    def post(self, request, format=None):
        try:
            data = request.data

            api_data = data['selectedRows']
            
            isOnline = True
            prompt = f"Hier sind weitere Daten: {api_data}. Bitte beantworten Sie die folgende Frage: {data['messages'][0]['prompt']}"
            model = data['model']
            
            messages = [
                {
                    "role": "system",
                    "content": "Bitte geben Sie eine prägnante Antwort auf Deutsch. Geben Sie die Ausgabe in deutscher Sprache in menschlich gut verstaendlichen weise aus (mit Absaetzen etc.)."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]

            if isOnline:
                api_key = os.environ["MISTRAL_API_KEY"]
                client = Mistral(api_key=api_key)
                chat_response = client.chat.complete(model=model, messages=messages)
                content = chat_response.choices[0].message.content
            else:
                content = "helloWorld"

            #print(content)
            return Response({"response": content})
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)

class TaxLLMTaxAddView(APIView):
    def post(self, request, format=None):
        try:
            data = request.data

            api_data = data['selectedRows']
            
            data = request.data
            isOnline = True
            prompt = f"Hier sind weitere Daten: {api_data}. Bitte beantworten Sie die folgende Frage: {data['messages'][0]['prompt']}"
            model = data['model']
#            print(model)

            messages = [
                {
                    "role": "system",
                    "content": "Bitte geben Sie eine prägnante Antwort auf Deutsch. Geben Sie die Ausgabe in deutscher Sprache in menschlich gut verstaendlichen weise aus (mit Absaetzen etc.)."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]

            if isOnline:
                api_key = os.environ["MISTRAL_API_KEY"]
                client = Mistral(api_key=api_key)
                chat_response = client.chat.complete(model=model, messages=messages)
                content = chat_response.choices[0].message.content
            else:
                content = "helloWorld"

#            print(content)
            return Response({"response": content})
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)