from pydantic import BaseModel
from pydantic import EmailStr
from pydantic import Field
from pydantic import field_validator


class UserBase(BaseModel):
    name: str = Field(
        ..., 
        min_length=3, 
        max_length=50, 
        pattern=r"^[a-zA-Z0-9_ ]+$"
    )
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72,)
    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v
    
class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True


class loginResponse(BaseModel):
    refreshToken: str
    accessToken: str

class login_credentials(BaseModel):
    email: str
    password: str

class RegisterResponse(BaseModel):
    success: bool
    message: str
    user: UserResponse


class meResponse(UserBase):
    id : str
    provider : str

class SuccessResponse(BaseModel):
    message: str
    status: bool
