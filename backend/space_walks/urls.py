from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.list_items, name='list_items'),
]

from rest_framework.routers import DefaultRouter
from .views import SpaceWalksViewSet

router = DefaultRouter()
router.register(r'space_walks', SpaceWalksViewSet)

urlpatterns = [
    # ... other URL patterns
    path('api/', include(router.urls)),
]
