from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.products import router as product_router
from backend.routes.users import router as user_router
from backend.routes.auth import router as auth_router
from backend.database import Base, engine
from backend.exceptions import AppException, app_exception_handler, generic_exception_handler
from backend.logging_config import logger
from fastapi.openapi.utils import get_openapi


app = FastAPI()

app.openapi_schema = None

Base.metadata.create_all(engine) # Takes metadata from Base and create all tables.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://127.0.0.1:5501", "http://localhost:63342"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Registering custom and generic exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


@app.get("/", tags=["Root"])
def greet():
    logger.info("Root endpoint hit")
    return "Welcome to Inventory Management System"


# IMPORTANT: includes api endpoints from routes
app.include_router(auth_router)
app.include_router(product_router)
app.include_router(user_router)
