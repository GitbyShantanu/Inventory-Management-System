from pydantic import BaseModel, Field
from backend.enums import UserRole
from typing import Optional

# For creating a new product (POST)
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Name cannot be empty")
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0, description="Price must be greater than 0")
    quantity: int = Field(..., ge=0, description="Quantity cannot be negative")

# For updating an existing product (PATCH)
class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)

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
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    username: str = Field(..., min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_.-]+$")
    password: str = Field(..., min_length=6)
    email: str = Field(..., pattern=r"^\S+@\S+\.\S+$")

# For logging in
class UserLogin(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)

# For updating an existing user
class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    username: Optional[str] = Field(None, min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_.-]+$")
    password: Optional[str] = Field(None, min_length=6)
    email: Optional[str] = Field(None, pattern=r"^\S+@\S+\.\S+$")

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
