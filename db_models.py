from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import declarative_base

Base = declarative_base() # why: tells SQLAlchemy that tables will be created using this base class.

class Product(Base): #why Base inheritance: to define this class as a table in the database

    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    price = Column(Float)
    quantity = Column(Integer)
