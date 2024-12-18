from django.urls import path
from .views import VisionLLMView, NIMVisionLLMView, TextLLMView, TranslateLLMView, SpeechLLMView, LlamaVisionView, IndicLLMView, TTSView, SpeechASRView, SpeechToSpeechView

urlpatterns = [
    path('vision_llm_url/', VisionLLMView.as_view()),
    path('nim_vision_llm_url/', NIMVisionLLMView.as_view()),
    path('text_llm_url/', TextLLMView.as_view()),
    path('translate_llm_url/', TranslateLLMView.as_view()),
    path('speech_llm_url/', SpeechLLMView.as_view()),
    path('speech_asr_url/', SpeechASRView.as_view()),
    path('llama_vision_url/', LlamaVisionView.as_view()),
    path('indic_llm_url/', IndicLLMView.as_view()),
    path('tts_url/', TTSView.as_view()),
    path('speech_to_speech_url/', SpeechToSpeechView.as_view()),
]
