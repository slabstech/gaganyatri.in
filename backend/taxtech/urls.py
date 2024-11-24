from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaxTechAppViewSet, TaxLLMView

router = DefaultRouter()
router.register(r'', TaxTechAppViewSet)

urlpatterns = [
    # ... other URL patterns
    path('', include(router.urls)),
    path('tax_llm_url/', TaxLLMView.as_view(), name='tax_llm_url'),
]