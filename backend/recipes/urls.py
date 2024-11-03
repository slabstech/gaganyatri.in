from django.urls import path
from .views import  recipe_generate_route

urlpatterns = [
    path('recipe_generate/', recipe_generate_route, name='recipe_generate'),
]
