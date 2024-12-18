# Generated by Django 5.1.1 on 2024-11-19 09:22

from django.db import migrations

def add_default_entries(apps, schema_editor):
    TaxTechApp = apps.get_model('taxtech', 'TaxTechApp')
    TaxTechApp.objects.create(appointment_day='2024-11-19', company_name='User 001', status='Pending', observations='Unverified')
    TaxTechApp.objects.create(appointment_day='2024-11-21', company_name='User 002', status='Confirmed', observations='Unverified')
    TaxTechApp.objects.create(appointment_day='2024-12-04', company_name='User 003', status='Cancelled', observations='Unverified')

class Migration(migrations.Migration):

    dependencies = [
        ('taxtech', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_default_entries),
    ]