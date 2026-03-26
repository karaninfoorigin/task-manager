from datetime import datetime, timedelta
import jwt 
from jwt import ExpiredSignatureError, InvalidTokenError, PyJWTError
from app.core.exception import UnauthorizedException
from fastapi import Request
from app.config.pydantic_setting import settings
import hashlib

def hash_token(token: str):
    return hashlib.sha256(token.encode()).hexdigest()

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.ACCESS_TOKEN_SECRET, algorithm="HS256")
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.REFRESH_TOKEN_SECRET, algorithm="HS256")
    return encoded_jwt

def verify_access_token(token: str):
    try:
        
        payload = jwt.decode(
            token,
            settings.ACCESS_TOKEN_SECRET,
            algorithms=["HS256"]
        )
        return payload

    except ExpiredSignatureError:
        raise UnauthorizedException("Access token expired")

    except PyJWTError:
        raise UnauthorizedException("Invalid access token")
    
def refresh_token_status(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.REFRESH_TOKEN_SECRET,
            algorithms=["HS256"]
        )
        return payload

    except ExpiredSignatureError:
        raise UnauthorizedException("Refresh token expired")

    except PyJWTError:
        raise UnauthorizedException("Invalid refresh token")
    

async def get_refresh_token(request: Request):
    token = request.cookies.get("refreshToken")
    if not token:
        raise UnauthorizedException("Refresh token missing")
    return token