from .models import TaxTechApp, TaxData, Company


class TaxTechAppSerializer:
    def to_representation(self, instance):
        return TaxTechApp(**instance).dict()

    def to_internal_value(self, data):
        return TaxTechApp(**data).dict()

class TaxDataSerializer:
    def to_representation(self, instance):
        return TaxData(**instance).dict()

    def to_internal_value(self, data):
        return TaxData(**data).dict()

class CompanySerializer:
    def to_representation(self, instance):
        return Company(**instance).dict()

    def to_internal_value(self, data):
        return Company(**data).dict()
