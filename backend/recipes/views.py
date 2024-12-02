# backend/recipes/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .engine import execute_prompt, bundle_function, propose_recipes, compute_reduced_prices
from pydantic import BaseModel, ValidationError
import json

class Article(BaseModel):
    name: str
    price: float
    # Add other fields as necessary

class Bundle(BaseModel):
    articles: list[Article]

class Recipe(BaseModel):
    name: str
    ingredients: list[str]
    instructions: str
    # Add other fields as necessary

@api_view(['GET'])
def recipe_generate_route(request):
    isLocal = False
    try:
        json_objs = compute_reduced_prices()
        obj = json.loads(json_objs)

        # Validate and parse the input data using Pydantic
        try:
            articles = [Article(**item) for item in obj[:10]]
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)

        bundle_articles = bundle_function(articles)

        result = execute_prompt(propose_recipes(bundle_articles), False)

        # Validate and parse the output data using Pydantic
        try:
            recipes = [Recipe(**item) for item in result]
        except ValidationError as e:
            return Response({'error': str(e)}, status=500)

    except (FileNotFoundError, json.JSONDecodeError) as e:
        return Response({'error': str(e)}, status=500)
    except Exception as e:
        print(f"An error occurred: {e}")
        return Response({'error': 'Something went wrong'}, status=500)

    return Response(recipes)