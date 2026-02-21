from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.products import router as product_router
from backend.database import Base, engine

app = FastAPI()

Base.metadata.create_all(engine) # Takes metadata from Base and create all tables.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/", tags=["Root"])
def greet():
    return "Welcome to Inventory Management System"


# IMPORTANT: includes api endpoints from routes/products
app.include_router(product_router)
