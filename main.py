from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import ProductCreate, ProductUpdate, ProductResponse
from db_config import session
from sqlalchemy.orm import Session
import db_models
from typing import Optional
from fastapi import Query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# To tell the database to create tables:
# Take all table definitions (models) registered under Base
# and physically create them in the connected database using the engine.
# (If a table already exists, it will be skipped.)
# Base.metadata.create_all(bind=engine)

# print("creating tables...")
# db_models.Base.metadata.create_all(bind=engine)
# print("done")


# Basic greet endpoint
@app.get("/")
def greet():
    return "Welcome to Inventory Management System"

#
# # In-memory list to store products
# products = [
#     Product(id=1, name="Laptop", description="A high performance laptop", price=999.99, quantity=10),
#     Product(id=2, name="Smartphone", description="THE latest model smartphone", price=699.99, quantity=25),
#     Product(id=3, name="Headphones", description="Noise cancelling headphones", price=199.99, quantity=15),
#     Product(id=4, name="Monitor", description="4K UHD Monitor", price=399.99, quantity=8)
# ]

# def init_db():
#     db = session()
#     count = db.query(db_models.Product).count()
#     if count == 0:
#         for product in products:
#             # alternative simpler way without unpacking :
#             # db.add(db_models.Product(
#             #     id = product.id,
#             #     name = product.name,
#             #     description = product.description,
#             #     price = product.price,
#             #     quantity = product.quantity
#             # ))
#             db.add(db_models.Product(**product.model_dump())) #model_dump() for converting pydantic models to dict and ** for unpacking ie. dict to keyword arguments
#     db.commit()

# init_db() # call the init_db function to sample initial data if db is empty


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


# Get method to fetch all products
@app.get("/products", response_model=list[ProductResponse])
def get_all_products(
    db: Session = Depends(get_db),
    search: str | None = None,
    page: int = 1,
    limit: int = 10
):

    products = db.query(db_models.Product).order_by(db_models.Product.id).all()

    # search by name query param
    if search:
        products = [prod for prod in products if search.lower() in prod.name.lower()]

    # Pagination (simple: start, end, slicing)
    start = (page - 1) * limit
    end = start + limit
    page_prod = products[start:end]

    return [ProductResponse.model_validate(prod) for prod in page_prod]


# Get method to fetch product by id
@app.get("/products/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(db_models.Product).filter(db_models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")
    return ProductResponse.model_validate(db_product)


# Post method to save a product
@app.post("/products", response_model=ProductResponse)
def save_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db_models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)  #Reload the object from the database to capture updated auto-generated fields (like ID).
    return ProductResponse.model_validate(db_product)


# Put method to update a product
@app.put("/products/{product_id}")
def update_product(product_id : int, product : ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(db_models.Product).filter(db_models.Product.id == product_id).first()
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        # Transform DB object into API response model (DTO)
        return ProductResponse.model_validate(db_product)  # Convert the input (dict or object) into a validated instance of this Pydantic model
    else:
        raise HTTPException(status_code=404, detail=f"Product with id: {product_id} not found")


@app.patch("/products/{product_id}", response_model=ProductResponse)
def patch_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(db_models.Product).filter(db_models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")

    # Get dict of only the fields that the user actually sent in RequestBody
    update_data = product.model_dump(exclude_unset=True)

    # Iterate over key-value pairs using .items() to access both directly
    for key, value in update_data.items():
        setattr(db_product, key, value)  # Update db obj fields dynamically with only patched keys values eg. db_prod.price(key) = 1200(value)

    db.commit()  # Reload the object from the database to capture updated auto-generated fields (like ID).
    db.refresh(db_product)
    return ProductResponse.model_validate(db_product)


# Delete method to delete a product
@app.delete("/products/{product_id}", response_model=ProductResponse)
def delete_prod_by_id(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(db_models.Product).filter(db_models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")

    db.delete(db_product)
    db.commit()
    return ProductResponse.model_validate(db_product)

