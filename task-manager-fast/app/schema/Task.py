from pydantic import BaseModel
from pydantic import Field
from app.models.taskModel import TaskStatus
from uuid import UUID
from typing import Optional
from app.schema.User import UserResponse

class TaskBase(BaseModel):
    title : str = Field(... , min_length=3, max_length=50)
    description :str = Field(..., min_length=10, max_length=1000)
    status : TaskStatus

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: UUID
    created_by: Optional[UserResponse]

    class Config:
        orm_mode = True

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = Field(None, min_length=10, max_length=1000)
    status: Optional[TaskStatus] = None