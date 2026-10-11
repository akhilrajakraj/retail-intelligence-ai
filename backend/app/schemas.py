
from pydantic import BaseModel, Field


class InactivityPredictionRequest(BaseModel):
    frequency: float = Field(ge=0)
    purchase_lines: float = Field(ge=0)
    monetary: float = Field(ge=0)
    average_line_value: float = Field(ge=0)
    unique_products: float = Field(ge=0)
    average_quantity: float = Field(ge=0)
    recency_days: float = Field(ge=0)
    average_order_value: float = Field(ge=0)
