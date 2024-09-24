from django.urls import path
from .views import execute_prompt_route, recipe_generate_route

urlpatterns = [
    path('execute_prompt/', execute_prompt_route, name='execute_prompt'),
    path('recipe_generate/', recipe_generate_route, name='recipe_generate'),
]
