from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, get_object_or_404, redirect
from .models import Country, CountryData, Questionnaire
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Country
from django.views.generic import ListView, DetailView, CreateView, UpdateView, TemplateView

class StartPageView(TemplateView):
    template_name = "dashboard/start_page.html"

def dashboard(request):
    countries = Country.objects.all()
    country_data = [
        {
            "name": country.name,
            "iso_code": country.iso_code,
            "latitude": country.latitude,
            "longitude": country.longitude,
            "pillar2_implemented": country.pillar2_implemented,
            "local_top_up_tax": country.local_top_up_tax,
        }
        for country in countries
    ]
    return render(request, 'dashboard/dashboard.html', {"countries": country_data})


def country_list(request):
    countries = Country.objects.all()
    return render(request, 'dashboard/country_list.html', {'countries': countries})

def country_detail(request, country_id, year):
    country = get_object_or_404(Country, id=country_id)
    data = get_object_or_404(CountryData, country=country, year=year)
    questionnaires = data.questionnaires.all()
    return render(request, 'dashboard/country_detail.html', {
        'country': country,
        'data': data,
        'questionnaires': questionnaires,
    })

@csrf_exempt
def mark_implausible(request, country_data_id):
    if request.method == 'POST':
        data = get_object_or_404(CountryData, id=country_data_id)
        data.is_plausible = False
        data.save()
        return JsonResponse({'status': 'success'})

@csrf_exempt
def send_questionnaire(request, country_data_id):
    if request.method == 'POST':
        question = request.POST.get('question')
        country_data = get_object_or_404(CountryData, id=country_data_id)
        Questionnaire.objects.create(
            country_data=country_data,
            question=question,
            created_by=request.user
        )
        return JsonResponse({'status': 'questionnaire_created'})


from django.shortcuts import render, get_object_or_404
from .models import Company

def company_detail(request, company_id):
    company = get_object_or_404(Company, id=company_id)
    return render(request, 'dashboard/company_detail.html', {"company": company})

def masterData(request):
    return render(request, 'dashboard/masterData.html')

def connectors(request):
    return render(request, 'dashboard/connectors.html')

def userManagement(request):
    return render(request, 'dashboard/userManagement.html')

def aiAgent(request):
    return render(request, 'dashboard/aiAgent.html')
