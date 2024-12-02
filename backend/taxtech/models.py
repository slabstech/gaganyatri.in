# backend/taxtech/schemas.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class TaxTechApp(BaseModel):
    id: int
    appointment_day: date
    company_name: str
    status: str
    observations: str

class TaxData(BaseModel):
    country: str
    currency: str
    ebt: int
    taxes: int
    quote: float
    check_data: str
    pot_mehrsteuer: int
    de_minimis: str
    five_percent_check: int
    revenues: Optional[int] = None
    salaries: int
    net_loss: int

class Company(BaseModel):
    name: str
    country: str
    currency: str
    ebt: int
    taxes: int
    revenues: int
    wages: int
    fixed_assets: int

    class Config:
        orm_mode = True