from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.products import router as product_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/", tags=["Root"])
def greet():
    return "Welcome to Inventory Management System"


# IMPORTANT: includes api endpoints from routes/products
app.include_router(product_router)
