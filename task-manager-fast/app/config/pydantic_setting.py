from pydantic_settings import BaseSettings

class Settings(BaseSettings):
   # Database
    DATABASE_URL:str

    # Security
    SECRET_KEY:str
    ALGORITHM:str
    ACCESS_TOKEN_SECRET:str
    REFRESH_TOKEN_SECRET:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int
    REFRESH_TOKEN_EXPIRE_DAYS:int
    CLIENT_ID:str
    CLIENT_SECRET:str

    DEBUG:bool

    # App
    APP_NAME: str = "DevConnect API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8080"

    # File Uploads
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 5
    
    class Config:
        env_file = ".env"

settings = Settings()