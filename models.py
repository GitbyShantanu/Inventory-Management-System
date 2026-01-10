from pydantic import BaseModel, ConfigDict

class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    quantity: int

    model_config = {
        "from_attributes": True
    }