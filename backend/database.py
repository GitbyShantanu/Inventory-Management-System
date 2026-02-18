from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env file")

engine = create_engine(DATABASE_URL)
session = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()
Base.metadata.create_all(engine) # Takes metadata from Base and create all tables.
