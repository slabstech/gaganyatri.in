from django.core.management.base import BaseCommand
from dashboard.models import Country, CountryData
import random

class Command(BaseCommand):
    help = 'Populate CountryData with random balance sheet values'

    def handle(self, *args, **kwargs):
        countries = Country.objects.all()
        for country in countries:
            for year in range(2020, 2025):  # Add data for multiple years
                balance_sheet = {
                    "Aktiva": {
                        "Anlagevermögen": {
                            "Sachanlagen": random.randint(10000, 50000),
                            "immaterielle Vermögensgegenstände": random.randint(5000, 20000),
                            "Finanzanlagen": random.randint(20000, 70000),
                        },
                        "Umlaufvermögen": {
                            "Vorräte": random.randint(3000, 15000),
                            "Forderungen": random.randint(5000, 25000),
                            "Kassenbestand": random.randint(1000, 5000),
                            "Wertpapiere": random.randint(10000, 20000),
                        }
                    },
                    "Passiva": {
                        "Eigenkapital": {
                            "Gezeichnetes Kapital": random.randint(50000, 100000),
                            "Kapitalrücklagen": random.randint(10000, 50000),
                            "Gewinnrücklagen": random.randint(20000, 60000),
                        },
                        "Fremdkapital": {
                            "Kurzfristige Verbindlichkeiten": random.randint(10000, 40000),
                            "langfristige Verbindlichkeiten": random.randint(30000, 80000),
                        }
                    }
                }

                CountryData.objects.create(
                    country=country,
                    year=year,
                    balance_sheet=balance_sheet,
                    company_name=f"Example Company {year}",
                    is_plausible=random.choice([True, False])
                )

        self.stdout.write(self.style.SUCCESS("Successfully populated CountryData"))