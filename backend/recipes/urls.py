from django.urls import path
from .views import  recipe_generate_route
from .views import VisionLLMView, NIMVisionLLMView, TextLLMView, TranslateLLMView

urlpatterns = [
    path('recipe_generate/', recipe_generate_route, name='recipe_generate'),
    path('vision_llm_url/', VisionLLMView.as_view()),
    path('nim_vision_llm_url/', NIMVisionLLMView.as_view()),
    path('text_llm_url/', TextLLMView.as_view()),
    path('translate_llm_url/', TranslateLLMView.as_view()),
]
