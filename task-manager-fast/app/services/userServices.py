from fastapi import APIRouter, Request, Depends, Response, status
from app.schema.User import SuccessResponse, meResponse, RegisterResponse
from app.models.userModel import User, UserDetail
from sqlalchemy import select, update
from app.core.exception import ConflictException,UnauthorizedException
from app.core.security import hash_password,verify_password
from app.core.token import create_access_token, create_refresh_token,hash_token 
from app.core.oauth import oauth
from fastapi.responses import RedirectResponse
from app.core.exception import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.db import get_db


router = APIRouter(prefix="/auth", tags=["login, registration", "oauth", "me"])



async def register(user_data, db):

    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    existing = result.scalar_one_or_none()

    if existing:
        raise ConflictException("Email already registered")

    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password),
    )
   
    db.add(user)
    await db.flush()
    await db.refresh(user)

    user_id_detail = UserDetail(
       user_id = user.id,
       provider = "local"
    )
    db.add(user_id_detail)
    await db.flush()
    await db.refresh(user_id_detail)

    return RegisterResponse(
        success=True,
        message="User registered successfully",
        user=user
    )


async def login(
   user_data ,
   response,
   db,
   ):
  result= await db.execute(
     select(User).where(
        User.email == user_data.email
     )
  )
  existing = result.scalar_one_or_none()
  
  if not existing or not verify_password(user_data.password, existing.password):
     raise UnauthorizedException("Invalid Credentials")
 
  accessToken = create_access_token({"id":existing.id})
  refreshToken= create_refresh_token({"id":existing.id})
  existing.refresh_token = hash_token(refreshToken)
  response.set_cookie(
      key="accessToken",
        value=accessToken,
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=60 * 15
  )
  response.set_cookie(
      key="refreshToken",
        value=refreshToken,
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=60 * 15
  )
  return SuccessResponse(
     message="Logged In Successfully",
     status= True,

  )

async def logout(response: Response, user_id: str, db:AsyncSession ):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise UnauthorizedException("User not found")


    user.refresh_token = None
    db.add(user)
    await db.commit()

    response.delete_cookie(
        key="accessToken",
        httponly=True,
        secure=True,
        samesite="Strict",
        path="/"
    )

    response.delete_cookie(
        key="refreshToken",
        httponly=True,
        secure=True,
        samesite="Strict",
        path="/"
    )
#     return SuccessResponse(
#      message="Logged out Successfully",
#      status= True
#   )
    return {"message": "Logged out successfully"}

async def me(
    request,
    db
):
    userid = request.state.user_id
    result = await db.execute(
        select(User.id,User.name, User.email, UserDetail.provider)
        .join(UserDetail, User.id == UserDetail.user_id)
        .where(User.id == userid)
    )
    
    user = result.first()
    if not user:
        raise UnauthorizedException("Invalid credentials")

    return meResponse(
        id = user.id,
        name=user.name,
        email=user.email,
        provider=user.provider
    )

async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


async def google_callback(request: Request, db:AsyncSession = Depends(get_db)):

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
        "email": existing.email,
    })

    refreshToken = create_refresh_token({
        "id": existing.id,
        "email": existing.email,
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

    return redirect_response

async def update_profile(request: Request,user_id:str, db: AsyncSession  ):
    try:
        body = await request.json()

        # Fetch user
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Update fields if provided
        if "name" in body:
            user.name = body["name"]

        if "email" in body:
            # check if email already exists
            existing = await db.execute(
                select(User).where(User.email == body["email"], User.id != user_id)
            )
            if existing.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
            user.email = body["email"]

        if "password" in body:
            # hash password before saving (IMPORTANT)
            
            user.password = hash_password(body["password"])

        # Save changes
        await db.commit()
        await db.refresh(user)

        return {
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }

    except Exception as e:
        print(f"***************** update profile error is{e}")
        await db.rollback()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )