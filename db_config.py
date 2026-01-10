from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker

db_url = "postgresql://postgres:pgsql123@localhost:5432/inventorydb"

engine = create_engine(db_url)
session = sessionmaker(bind=engine, autoflush=False, autocommit=False)


