from sqlalchemy import (
    Column, String, ForeignKey, Enum, 
)
from sqlalchemy.orm import relationship
import enum
from app.config.db import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class UserProvider(str, enum.Enum):
    local = "local"
    google = "google"
    facebook = "Facebook"
    github = "Github"

class User(Base):
    __tablename__="users"
    id = Column(String, primary_key=True, default= generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique= True, nullable= False, index= True)
    password = Column(String, nullable=True)
    refresh_token = Column(String, nullable=True)
    tasks_created = relationship("Task", back_populates="created_by")

class UserDetail(Base):
    __tablename__="user_id_detail"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    provider = Column(Enum(UserProvider), default=UserProvider.local, nullable=False)