from django.db import models

class TaxTechApp(models.Model):
    id = models.BigAutoField(primary_key=True)
    appointment_day = models.DateField()
    company_name = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    observations = models.TextField()

class TaxData(models.Model):
    country = models.CharField(max_length=255)
    currency = models.CharField(max_length=10)
    ebt = models.IntegerField()
    taxes = models.IntegerField()
    quote = models.FloatField()
    check_data = models.CharField(max_length=255)
    pot_mehrsteuer = models.IntegerField()
    de_minimis = models.CharField(max_length=10)
    five_percent_check = models.IntegerField()
    revenues = models.IntegerField(null=True, blank=True)
    salaries = models.IntegerField()
    net_loss = models.IntegerField()

# backend/taxtech/models.py

class Company(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    currency = models.CharField(max_length=10)
    ebt = models.IntegerField()
    taxes = models.IntegerField()
    revenues = models.IntegerField()
    wages = models.IntegerField()
    fixed_assets = models.IntegerField()

    def __str__(self):
        return self.name