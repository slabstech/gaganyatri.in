from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaxTechAppViewSet, TaxLLMView, TaxDataViewSet, CompanyViewSet

router = DefaultRouter()
router.register(r'taxtechapp', TaxTechAppViewSet)
router.register(r'taxdata', TaxDataViewSet)
router.register(r'company', CompanyViewSet)



urlpatterns = [
    # ... other URL patterns
    path('taxdata/', include(router.urls)),
    path('tax_llm_url/', TaxLLMView.as_view(), name='tax_llm_url'),
]