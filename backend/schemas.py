from pydantic import BaseModel
from backend.enums import UserRole
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
    description: Optional[str] = None
    price: float
    quantity: int

    model_config = {
        "from_attributes": True
    }


# For creating a new user
class UserCreate(BaseModel):
    name: Optional[str] = None
    username: str
    password: str
    email: str

# For logging in
class UserLogin(BaseModel):
    username: str
    password: str

# For updating an existing user
class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None

# For returning user data
class UserResponse(BaseModel):
    id: int
    name: Optional[str] = None
    username: str
    email: str
    role: UserRole # Role will always be present in response

    model_config = {
        "from_attributes": True
    }
