from django.urls import path
from .views import execute_prompt_route, recipe_generate_route, execute_prompt_route_get
from .views import MyModelView

urlpatterns = [
    path('execute_prompt_get/', execute_prompt_route_get, name='execute_prompt_get'),
    path('execute_prompt/', execute_prompt_route, name='execute_prompt'),
    path('recipe_generate/', recipe_generate_route, name='recipe_generate'),
    path('api/mymodel/', MyModelView.as_view(), name='mymodel-create'),
]
