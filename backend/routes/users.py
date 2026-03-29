from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.auth_config import hash_password
from backend.exceptions import AppException
from backend.logging_config import logger
from backend.schemas import UserResponse, UserCreate, UserUpdate
import backend.models as models

router = APIRouter(prefix="/users", tags=["Users"])

# Get all users
@router.get("/", response_model=list[UserResponse], status_code=status.HTTP_200_OK)
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).order_by(models.User.id).all()
    return users

# Get user by ID
@router.get("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise AppException("User not found", 404)
    return user


# Update a user
@router.put("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise AppException(f"User with id: {user_id} not found", 404)

    try:
        update_data = user.model_dump(exclude_unset=True)
        if "password" in update_data:
            # Remove plain password from dict
            plain_password = update_data.pop("password")
            # Hash password and map it to DB field because model and dto password field name mismatch
            update_data["hashed_password"] = hash_password(plain_password)

        for key, value in update_data.items():
            setattr(db_user, key, value)

        db.commit()
        db.refresh(db_user)
        logger.info(f"User updated: {db_user.id} - {db_user.username}")
        return db_user
    except IntegrityError:
        db.rollback()
        raise AppException("Username or email already exists", 409)


# Delete a user
@router.delete("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def delete_user_by_id(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise AppException(f"User with id: {user_id} not found", 404)

    db.delete(db_user)
    db.commit()
    logger.info(f"User deleted: {db_user.id} - {db_user.username}")
    return db_user
