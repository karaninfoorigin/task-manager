from fastapi import Response
from app.core.token import create_access_token, create_refresh_token, hash_token
from app.models.userModel import User
from sqlalchemy import select
from app.core.exception import UnauthorizedException
from sqlalchemy.ext.asyncio import AsyncSession 
from app.config.pydantic_setting import settings
import jwt


async def refresh_token_service(
    response: Response,
    refresh_token: str,
    db:AsyncSession 
):
    try:
        print("user")
        payload = jwt.decode(
            refresh_token,
            settings.REFRESH_TOKEN_SECRET,
            algorithms=["HS256"]
        )
    except jwt.ExpiredSignatureError:
        raise UnauthorizedException("Refresh token expired")
    except jwt.InvalidTokenError:
        raise UnauthorizedException("Invalid refresh token")

    user_id = payload.get("id")
    if not user_id:
        raise UnauthorizedException("Invalid token payload")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise UnauthorizedException("User not found")

    incoming_hash = hash_token(refresh_token)

    if user.refresh_token != incoming_hash:
        raise UnauthorizedException("Token mismatch (possible attack)")

    new_access_token = create_access_token({"id": user_id})
    new_refresh_token = create_refresh_token({"id": user_id})

    user.refresh_token = hash_token(new_refresh_token)
    db.add(user)
    await db.commit()

    response.set_cookie(
        key="accessToken",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=60 * 15  # 15 min
    )

    response.set_cookie(
        key="refreshToken",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    return {"message": "Token refreshed successfully"}

