from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaxTechAppViewSet

router = DefaultRouter()
router.register(r'', TaxTechAppViewSet)

urlpatterns = [
    # ... other URL patterns
    path('', include(router.urls)),
]