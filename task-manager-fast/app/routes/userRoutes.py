from fastapi import APIRouter, Depends, Response, status, Request
from app.schema.User import SuccessResponse, meResponse,UserCreate, login_credentials, RegisterResponse
from sqlalchemy.ext.asyncio import AsyncSession 
from app.config.db import get_db
from app.core.middleware import verify_user
from app.services.userServices import register, login, me,  update_profile, logout
from app.core.oauth import oauth
from sqlalchemy import select, update
from app.models.userModel import User, UserDetail
from app.core.token import create_access_token, create_refresh_token, hash_token
from fastapi.responses import RedirectResponse
from app.core.exception import HTTPException
router = APIRouter(prefix="/auth", tags=["login, registration", "oauth", "me"])

# register route
@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED
)
async def register_route(user_data: UserCreate, db: AsyncSession = Depends(get_db)):

  return await register(user_data,db)


@router.post('/login', response_model=SuccessResponse, status_code=200)
async def login_route(
   user_data : login_credentials,
   response: Response,
   db: AsyncSession = Depends(get_db),
   
):
  return await login(user_data, response, db)
     
@router.get("/logout")
async def logout_route(response:Response, db:AsyncSession = Depends(get_db), user_id:str = Depends(verify_user)):
   return await logout( response, user_id, db)

@router.get("/me", response_model=meResponse, status_code=200)
async def me_route(
    request: Request,
    db: AsyncSession = Depends(get_db),
     _: None = Depends(verify_user)
):
    return await me(request, db)

@router.get("/google/login")
async def google_login_route(request:Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)
   
@router.get("/google/callback") 
async def google_callback(request:Request,db:AsyncSession = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    if not user_info:
        raise HTTPException(status_code=400, detail="Google user info not found")

    email = user_info["email"]
    name = user_info["name"]

    result = await db.execute(select(User).where(User.email == email))
    existing = result.scalar_one_or_none()

    if not existing:
        existing = User(
            email=email,
            name=name,
            password=None
        )

        db.add(existing)
        await db.commit()
        await db.refresh(existing)

        user_id_detail = UserDetail(
        user_id = existing.id,
        provider = "google"
        )

        db.add(user_id_detail)
        await db.flush()
        await db.refresh(user_id_detail)

    if existing:
       await db.execute(update(UserDetail).where(UserDetail.user_id == existing.id).values(provider='google'))

    accessToken = create_access_token({
        "id": existing.id,
    })

    refreshToken = create_refresh_token({
        "id": existing.id,
    })

    redirect_response = RedirectResponse(url="http://localhost:4200/dashboard")

    redirect_response.set_cookie(
        key="accessToken",
        value=accessToken,
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=60 * 15
    )

    redirect_response.set_cookie(
        key="refreshToken",
        value=refreshToken,
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7
    )
    existing.refresh_token = hash_token(refreshToken)
    return redirect_response
   

@router.patch("/update_profile")
async def update_profile_route(
    request: Request,
    user_id: str = Depends(verify_user),
      db : AsyncSession = Depends(get_db)  # make sure this returns user id
):
   return await update_profile(request, user_id, db)