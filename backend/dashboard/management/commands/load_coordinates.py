import json
from django.core.management.base import BaseCommand
from dashboard.models import Country

class Command(BaseCommand):
    help = "Load country data into the database"

    def handle(self, *args, **kwargs):
        data = [
            {"name": "Germany", "iso_code": "DE", "latitude": 51.1657, "longitude": 10.4515, "pillar2_implemented": True, "local_top_up_tax": True},
            {"name": "France", "iso_code": "FR", "latitude": 46.6034, "longitude": 1.8883, "pillar2_implemented": True, "local_top_up_tax": False},
            {"name": "United States", "iso_code": "US", "latitude": 37.0902, "longitude": -95.7129, "pillar2_implemented": False, "local_top_up_tax": False},
            {"name": "Japan", "iso_code": "JP", "latitude": 36.2048, "longitude": 138.2529, "pillar2_implemented": True, "local_top_up_tax": True},
            {"name": "India", "iso_code": "IN", "latitude": 20.5937, "longitude": 78.9629, "pillar2_implemented": False, "local_top_up_tax": False}
        ]

        for country_data in data:
            country, created = Country.objects.get_or_create(
                name=country_data["name"],
                iso_code=country_data["iso_code"],
                latitude=country_data["latitude"],
                longitude=country_data["longitude"],
                pillar2_implemented=country_data["pillar2_implemented"],
                local_top_up_tax=country_data["local_top_up_tax"]
            )
            self.stdout.write(f"{'Created' if created else 'Updated'}: {country.name}")