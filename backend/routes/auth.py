from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.auth_config import verify_password, hash_password, create_access_token
from backend.database import get_db
from backend.exceptions import AppException
from backend.logging_config import logger
from backend.schemas import UserResponse, UserCreate, UserLogin
import backend.models as models
from backend.enums import UserRole

router = APIRouter(prefix="/auth", tags=["Auth"])


# To register a new user
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # db_user = models.User(user.model_dump()) # why this dont work : model and dto password field name mismatch

    # Check if this is the very first user in the database
    is_first_user = db.query(models.User).count() == 0

    db_user = models.User(
        name=user.name,
        username=user.username.strip().lower(),
        hashed_password=hash_password(user.password),
        email=user.email.strip().lower(),
        role=UserRole.ADMIN if is_first_user else UserRole.USER
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"User registered: {db_user.id} - {db_user.username}")
        return db_user
    except IntegrityError:
        db.rollback()
        raise AppException(f"User with username {user.username} already exists", 409)


# To login a user
@router.post("/login", status_code=status.HTTP_200_OK)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user_credentials.username).first()

    # if user exists and password matches
    if db_user and verify_password(user_credentials.password, db_user.hashed_password):

        # create access token by passing user id and username as dict in payload and return bearer access token.
        token = create_access_token({
            "user_id": db_user.id,
            "username": db_user.username,
            "role": db_user.role
        })

        logger.info(f"User logged in: {db_user.username}")

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": db_user.role
        }

    raise AppException("Invalid username or password", 401)
