from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas import ProductResponse, ProductCreate, ProductUpdate
from backend.database import session
import backend.models as models

router = APIRouter(prefix="/products", tags=["Products"])


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


# Get all products
@router.get("/", response_model=list[ProductResponse])
def get_all_products(
    db: Session = Depends(get_db),
    search: str | None = None,
    page: int = 1,
    limit: int = 10
):
    products = db.query(models.Product).order_by(models.Product.id).all()

    if search:
        products = [p for p in products if search.lower() in p.name.lower()]

    start = (page - 1) * limit
    end = start + limit
    return [p for p in products[start:end]]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    return prod


# Post method to save a product
@router.post("/", response_model=ProductResponse)
def save_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)  #Reload the object from the database to capture updated auto-generated fields (like ID).
    return db_product


# Put method to update a product
@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id : int, product : ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        # Transform DB object into API response model (DTO)
        return db_product
    else:
        raise HTTPException(status_code=404, detail=f"Product with id: {product_id} not found")


@router.patch("/products/{product_id}", response_model=ProductResponse)
def patch_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")

    # Get dict of only the fields that the user actually sent in RequestBody
    update_data = product.model_dump(exclude_unset=True)

    # Iterate over key-value pairs using .items() to access both directly
    for key, value in update_data.items():
        setattr(db_product, key, value)  # Update db obj fields dynamically with only patched keys values eg. db_prod.price(key) = 1200(value)

    db.commit()  # Reload the object from the database to capture updated auto-generated fields (like ID).
    db.refresh(db_product)
    return db_product


# Delete method to delete a product
@router.delete("/products/{product_id}", response_model=ProductResponse)
def delete_prod_by_id(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")

    db.delete(db_product)
    db.commit()
    return db_product


