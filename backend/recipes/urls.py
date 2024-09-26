from django.urls import path
from .views import  recipe_generate_route, execute_prompt_route_get

urlpatterns = [
    path('execute_prompt_get/', execute_prompt_route_get, name='execute_prompt_get'),
    path('recipe_generate/', recipe_generate_route, name='recipe_generate'),
]
