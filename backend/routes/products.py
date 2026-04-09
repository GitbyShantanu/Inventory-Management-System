from sqlalchemy.exc import IntegrityError

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.exceptions import AppException
from backend.logging_config import logger
from backend.schemas import ProductResponse, ProductCreate, ProductUpdate
import backend.models as models


router = APIRouter(prefix="/products", tags=["Products"])

# Get all products
@router.get("/", response_model=list[ProductResponse], status_code=status.HTTP_200_OK)
def get_all_products(
    db: Session = Depends(get_db),
    search: str | None = None,
    page: int = 1,
    limit: int = 10
):
    products = db.query(models.Product).order_by(models.Product.id).all()

    # If a search query is provided, filter products based on name, description, id, or price
    if search: 
        search_lower = search.lower()
        products = [
            p for p in products 
            if search_lower in p.name.lower() or
               (p.description and (search_lower in p.description.lower())) or # Handle case where description might be None
               search_lower in str(p.id) or
               search_lower in str(p.price)
        ]

    start = (page - 1) * limit
    end = start + limit
    # logger.info(f"Retrieved {len(products)} products (page {page}, limit {limit})")
    return [p for p in products[start:end]]


@router.get("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def get_product_by_id(
        product_id: int,
        db: Session = Depends(get_db)
):
    prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not prod:
        raise AppException("Product not found", 404)

    # logger.info(f"Product retrieved: {prod.id} - {prod.name}")
    return prod


# Post method to save a product
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def save_product(
        product: ProductCreate,
        db: Session = Depends(get_db)
):
    product.name = product.name.strip().title()
    db_product = models.Product(**product.model_dump())
    try:
        db.add(db_product)
        db.commit()
        db.refresh(db_product)  #Reload the object from the database to capture updated auto-generated fields (like ID).
        logger.info(f"Product created: {db_product.id} - {db_product.name}")
        return db_product

    except IntegrityError:
        db.rollback()
        raise AppException(f"Product with the name {product.name} already exists", 409)


# Put method to update a product
@router.put("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def update_product(
        product_id : int,
        product : ProductUpdate,
        db: Session = Depends(get_db)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise AppException(f"Product with id: {product_id} not found", 404)

    try:
        product.name = product.name.strip().title()

        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        db.refresh(db_product)
        logger.info(f"Product updated: {db_product.id} - {db_product.name}")
        return db_product

    except IntegrityError:
        db.rollback()
        raise AppException(f"Product with the name {product.name} already exists", 409)


@router.patch("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def patch_product(
        product_id: int,
        product: ProductUpdate,
        db: Session = Depends(get_db)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise AppException(f"Product with id: {product_id} not found", 404)

    try:
        if product.name:
            product.name = product.name.strip().title()

        # Get dict of only the fields that the user actually sent in RequestBody
        update_data = product.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_product, key, value)

        db.commit()
        db.refresh(db_product)
        logger.info(f"Product updated: {db_product.id} - {db_product.name}")
        return db_product

    except IntegrityError:
        db.rollback()
        raise AppException(f"Product with the name {product.name} already exists", 409)


# Delete method to delete a product
@router.delete("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def delete_product_by_id(
        product_id: int,
        db: Session = Depends(get_db)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise AppException(f"Product with id: {product_id} not found", 404)

    db.delete(db_product)
    db.commit()
    logger.info(f"Product deleted: {db_product.id} - {db_product.name}")
    return db_product
