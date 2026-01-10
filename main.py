from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Product
from db_config import engine, session
from sqlalchemy.orm import Session
import db_models
from logging import log

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
db_models.Base.metadata.create_all(bind=engine)
# print("done")


# Basic greet endpoint
@app.get("/")
def greet():
    return "Welcome to Inventory Management System"


# In-memory list to store products 
products = [
    Product(id=1, name="Laptop", description="A high performance laptop", price=999.99, quantity=10),
    Product(id=2, name="Smartphone", description="A latest model smartphone", price=699.99, quantity=25),
    Product(id=3, name="Headphones", description="Noise cancelling headphones", price=199.99, quantity=15),
    Product(id=4, name="Monitor", description="4K UHD Monitor", price=399.99, quantity=8)
]

def init_db():
    db = session()

    count = db.query(db_models.Product).count()
    if count == 0:
        for product in products:
            # alternative simpler way without unpacking :
            # db.add(db_models.Product(
            #     id = product.id,
            #     name = product.name,
            #     description = product.description,
            #     price = product.price,
            #     quantity = product.quantity
            # ))
            db.add(db_models.Product(**product.model_dump())) #model_dump() for converting pydantic models to dict and ** for unpacking ie. dict to keyword arguments
    db.commit()

init_db() # call the init_db function to sample initial data if db is empty

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

# Get method to fetch all products
@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    try:
        db_all_products = db.query(db_models.Product).order_by(db_models.Product.id).all()
        return [Product.model_validate(prod) for prod in db_all_products] # list comprehension to convert each SQLAlchemy model to Pydantic model. converts list to json implicitly by FastAPI
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error while fetching products: "+str(e))


# Get method to fetch product by id
@app.get("/products/{id}")
def get_product_by_id(id : int, db: Session = Depends(get_db)):
    db_product = db.query(db_models.Product).filter(db_models.Product.id == id).first()
    if db_product:
        return Product.model_validate(db_product) # converting db formatted single object to pydantic object 
    else:   
        raise HTTPException(status_code=404, detail = f"Product with id: {id} not found")


# Post method to save a product
@app.post("/products")
def save_product(product: Product, db: Session = Depends(get_db)):
    try:
        db.add(db_models.Product(**product.model_dump()))
        db.commit()
        return product
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error while saving product: "+str(e))
        

# Put method to update a product
@app.put("/products/{id}")
def update_product(id : int, product : Product, db: Session = Depends(get_db)):
    db_product = db.query(db_models.Product).filter(db_models.Product.id == id).first()
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        return Product.model_validate(db_product) 
    else:
        raise HTTPException(status_code=404, detail=f"Product with id: {id} not found")


# Delete method to delete a product
@app.delete("/products/{id}")
def delete_prod_by_id(id : int, db: Session = Depends(get_db)):
    db_product = db.query(db_models.Product).filter(db_models.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        # return db_product
        return Product.model_validate(db_product)  
    else:
        raise HTTPException(status_code=404, detail=f"Product with id: {id} not found")
    

