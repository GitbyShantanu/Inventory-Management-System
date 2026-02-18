from pydantic import BaseModel
from typing import Optional


# For creating a new product (POST)
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    quantity: int

# For updating an existing product (PATCH)
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

# For returning product data (GET responses)
class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    quantity: int

    class Config:
        from_attributes: True

