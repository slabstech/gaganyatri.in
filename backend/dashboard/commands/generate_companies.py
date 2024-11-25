import random
from django.core.management.base import BaseCommand
from dashboard.models import Country, Company


class Command(BaseCommand):
    help = "Generate random companies for all countries"

    def handle(self, *args, **kwargs):
        company_names = [
            "Global Tech Inc.", "Alpha Industries", "Beta Solutions", "Delta Corp.",
            "Zeta Enterprises", "Omega Systems", "Apollo Holdings", "Titan Innovations"
        ]

        for country in Country.objects.all():
            self.stdout.write(f"Generating companies for {country.name}...")
            for _ in range(random.randint(3, 6)):  # Generate 3-6 companies per country
                Company.objects.create(
                    name=random.choice(company_names),
                    country=country,
                    balance_sheet={
                        "Aktiva": {
                            "Anlagevermögen": random.randint(100000, 500000),
                            "Umlaufvermögen": random.randint(50000, 200000)
                        },
                        "Passiva": {
                            "Eigenkapital": random.randint(70000, 300000),
                            "Fremdkapital": random.randint(20000, 150000)
                        }
                    }
                )
        self.stdout.write(self.style.SUCCESS("Companies successfully generated!"))
