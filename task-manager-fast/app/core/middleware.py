import time
import logging
from fastapi import Request, Response, Depends
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.exception import UnauthorizedException, HTTPException
from app.core.token import verify_access_token
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.db import get_db
from app.models.userModel import User
from sqlalchemy.future import select
from app.core.token import refresh_token_status
logger = logging.getLogger("devconnect")
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.perf_counter()
        response = await call_next(request)
        duration = (time.perf_counter() - start) * 1000

        logger.info(
            f"{request.method} {request.url.path} "
            f"→ {response.status_code} ({duration:.1f}ms)"
        )
        response.headers["X-Process-Time"] = f"{duration:.1f}ms"
        return response

async def verify_user(request: Request):
    token = request.cookies.get("accessToken")

    if not token:
        raise UnauthorizedException("Token missing")

    payload = verify_access_token(token)   # your JWT decode function

    if not payload:
        raise UnauthorizedException("Invalid token")

    request.state.user_id = payload["id"]
    return payload["id"] 

async def verify_refresh_token(request: Request, db: AsyncSession= Depends(get_db)):
    user_id = Request.query_params.get("id")
    if not user_id:
        raise HTTPException("User id not found")
    result = await db.execute(
      select(User).where(
            User.id == user_id
        )
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException("User not found")
    refresh_token = user.refresh_token
    refresh_token_status(refresh_token)
    return


    
    