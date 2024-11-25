from django.urls import path
from . import views
from .views import (
    StartPageView,
    masterData,
    connectors,
    userManagement,
    aiAgent,)


urlpatterns = [
    path('', StartPageView.as_view(), name='start_page'),  # Startseite
    path('overview', views.dashboard, name='dashboard'),  # Dashboard
    path('masterData', masterData, name='masterData'),  # Master Data
    path('connectors', connectors, name='connectors'),  # Connectors
    path('userManagement', userManagement, name='userManagement'),  # User Management
    path('aiAgent', aiAgent, name='aiAgent'),  # AI Agent
    path('countries/', views.country_list, name='country_list'),
    path('countries/<int:country_id>/<int:year>/', views.country_detail, name='country_detail'),
    path('mark_implausible/<int:country_data_id>/', views.mark_implausible, name='mark_implausible'),
    path('send_questionnaire/<int:country_data_id>/', views.send_questionnaire, name='send_questionnaire'),
    path('companies/<int:company_id>/', views.company_detail, name='company_detail'),

]