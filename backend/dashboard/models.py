from django.contrib.auth.models import User
from django.db import models

class Country(models.Model):
    name = models.CharField(max_length=100)
    iso_code = models.CharField(max_length=10)
    latitude = models.FloatField()
    longitude = models.FloatField()
    part_of_pillar2 = models.BooleanField(default=False)
    pillar2_implemented = models.BooleanField(default=False)  # Neu
    local_top_up_tax = models.BooleanField(default=False)     # Neu

    def __str__(self):
        return self.name

class CountryData(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    year = models.IntegerField()
    balance_sheet = models.JSONField(default=dict)  # JSONField for structured data
    company_name = models.CharField(max_length=255)
    is_plausible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.country.name} - {self.year}"

class Questionnaire(models.Model):
    country_data = models.ForeignKey(CountryData, on_delete=models.CASCADE, related_name='questionnaires')
    question = models.TextField()
    response = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Questionnaire for {self.country_data.country.name} ({self.country_data.year})"

class Company(models.Model):
    name = models.CharField(max_length=200)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='companies')
    balance_sheet = models.JSONField()  # JSONField to store Aktiva/Passiva data

    def __str__(self):
        return self.name