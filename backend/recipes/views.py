from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from engine import execute_prompt, bundle_function, propose_recipes, get_json_objects, compute_reduced_prices
import json

@api_view(['POST'])
def execute_prompt_route(request):
    prompt = request.data.get('prompt')
    result = execute_prompt(prompt)
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
