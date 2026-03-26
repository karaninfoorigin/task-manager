from sqlalchemy import (
    Column, String,ForeignKey, Enum
)
from sqlalchemy.orm import relationship
import enum
import uuid
from app.config.db import Base



def generate_uuid():
    return str(uuid.uuid4())

class TaskStatus(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    completed = "completed"



class Task(Base):
    __tablename__="tasks"
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String,nullable=False)
    description =  Column(String, nullable=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.open, nullable= False)
    created_by_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_by = relationship("User", back_populates="tasks_created")