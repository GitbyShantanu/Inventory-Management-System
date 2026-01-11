from pydantic import BaseModel
from typing import Optional

# Common fields shared only across schemas not for APIs
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    quantity: int

# For creating a new product (POST)
class ProductCreate(ProductBase):
    pass # why: all fields required for POST(save) are exact as ProductBase so use that.

# For updating an existing product (PATCH)
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

# For returning product data (GET responses)
class ProductResponse(ProductBase):
    id: int     #other fields indirectly inherited from ProductBase, but user needs {id:} in response which is handled by server that's why not in ProductBase. why:

    model_config = {
        # Allows to Map object attributes to pydantic model fields if they are matching (obj.name -> schema.name)
        "from_attributes": True
    }
