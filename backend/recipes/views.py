from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers
from .engine import execute_prompt, bundle_function, propose_recipes, get_json_objects, compute_reduced_prices
import json

class PromptSerializer(serializers.Serializer):
    prompt = serializers.CharField()

@api_view(['POST'])
def execute_prompt_route(request):
    serializer = PromptSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    prompt = serializer.validated_data['prompt']
    is_local = False
    result = execute_prompt(prompt, is_local)
    return Response(result)


@api_view(['GET'])
def execute_prompt_route_get(request):
    prompt = request.query_params.get('prompt', None)
    if prompt is None:
        return Response({"error": "No prompt provided"}, status=400)
    is_local = False
    result = execute_prompt(prompt, is_local)
    return Response(result)

'''
@api_view(['POST'])
def execute_prompt_route(request):
    prompt = request.data.get('prompt')
    is_local=False
    result = execute_prompt(prompt, is_local)
    return Response(result)
'''
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


@api_view(['POST'])
def recipe_generate_route(request):
    try:
        data = request.data
        if not isinstance(data, dict) or 'ingredients' not in data:
            return Response({'error': 'Invalid input. Expected JSON with an \'ingredients\' key.'}, status=400)

        ingredients_json = json.dumps(data['ingredients'])
        obj = json.loads(compute_reduced_prices(ingredients_json))
        bundle_articles = bundle_function(obj[:10])
        result = execute_prompt(propose_recipes(bundle_articles))

    except (FileNotFoundError, json.JSONDecodeError) as e:
        return Response({'error': str(e)}, status=500)
    except Exception as e:
        print(f"An error occurred: {e}")
        return Response({'error': 'Something went wrong'}, status=500)
    return Response(result)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MyModelSerializer
'''
class MyModelView(APIView):
    def post(self, request):
        serializer = MyModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
'''
class MyModelView(APIView):
    def post(self, request):
        serializer = MyModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
