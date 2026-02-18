from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# if not DATABASE_URL:
#     raise ValueError("DATABASE_URL is not set in .env file")

if DATABASE_URL:
    print("Using cloud DB")
else:
    print("No DB configured, skipping DB connection")

engine = create_engine(DATABASE_URL)
session = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()
Base.metadata.create_all(engine) # Takes metadata from Base and create all tables.
