from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

# Jo classes Base inherit karegi, wo DB tables hain
class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
