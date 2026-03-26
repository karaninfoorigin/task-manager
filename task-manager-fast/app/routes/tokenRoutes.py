from fastapi import APIRouter,Request, Response, Depends;
from app.services.tokenServices import  refresh_token_service
from sqlalchemy.ext.asyncio import AsyncSession 
from app.config.db import get_db
from app.core.token import get_refresh_token
tokenRouter = APIRouter(prefix="/token", tags=["Tokens", "Create Refresh Token"])

@tokenRouter.get('/refresh-token')
async def refresh_token_route(
    request: Request,
    response: Response,
    refresh_token: str = Depends(get_refresh_token),
    db:AsyncSession = Depends(get_db)
):
    return await refresh_token_service(response,refresh_token,db)


