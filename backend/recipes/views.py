from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers
from .engine import execute_prompt, bundle_function, propose_recipes, compute_reduced_prices
import json

class PromptSerializer(serializers.Serializer):
    prompt = serializers.CharField()


@api_view(['GET'])
def execute_prompt_route_get(request):
    prompt = request.query_params.get('prompt', None)
    print(prompt)
    if prompt is None:
        return Response({"error": "No prompt provided"}, status=400)
    is_local = False
    result = execute_prompt(prompt, is_local)
    return Response(result)


@api_view(['GET'])
def recipe_generate_route(request):
    try:
        json_objs = compute_reduced_prices()
        obj= json.loads(json_objs)
        bundle_articles = bundle_function(obj[:10])
        result = execute_prompt(propose_recipes(bundle_articles))
    except (FileNotFoundError, json.JSONDecodeError) as e:
        return Response({'error': str(e)}, status=500)
    except Exception as e:
        print(f"An error occurred: {e}")
        return Response({'error': 'Something went wrong'}, status=500)
    return Response(result)

