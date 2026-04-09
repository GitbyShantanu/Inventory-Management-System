import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.database import session
import backend.models as models
from backend.exceptions import AppException

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Yahan humne 30 minutes set kiya hai

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=True)


# Password
def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# JWT
def create_access_token(data: dict): # data is a dict that may contain user_id, username, email etc to encode in the token.
    to_encode = data.copy() # copy user data to a new dict to avoid modifying the original one
    
    # calculate the expiry time for the token
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # add the expiry time to data we want to encode in token
    to_encode.update({"exp": expire})  
    access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return access_token


def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# Current User Dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_access_token(token)

    if payload is None:
        raise AppException("Invalid or expired token", 401)

    db = session()
    user = db.query(models.User).filter(models.User.id == payload.get("user_id")).first()
    db.close()

    if user is None:
        raise AppException("User not found", 404)

    return user