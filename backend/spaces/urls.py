"""
URL configuration for spaces project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path, include

schema_view = get_schema_view(
    openapi.Info(
        title="Gaganyatri",
        default_version='v1',
        description="API for Space Operations",
        terms_of_service="https://www.gaganyatri.in/",
        contact=openapi.Contact(email="info@slabstech.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    urlconf='spaces.urls',
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/v1/space_walks/', include('space_walks.urls')),
    path('api/v1/recipes/', include('recipes.urls')),
    path('api/v1/inference/', include('inference.urls')),
    path('api/v1/accounts/', include('accounts.urls')),
    path('games/', include('games.urls')),
    path('api/v1/taxtech/', include('taxtech.urls')),
    path('api/v1/dashboard/', include('dashboard.urls')),  # Include dashboard app URLs
]
