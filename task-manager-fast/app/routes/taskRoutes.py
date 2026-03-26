from fastapi import APIRouter, Depends, Request, WebSocket
from app.schema.Task import TaskResponse, TaskCreate,TaskUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.db import get_db
from app.core.exception import authFuc
from app.core.middleware import verify_user
from app.core.websocket_manager import ConnectionManager
from app.services.taskServices import task_websocket, getAllTask,createTask, updateTask
taskRouter= APIRouter(prefix="/user", tags=["creation, updation, deletion, read, task"])
active_connections: list[WebSocket] = []

manager = ConnectionManager()  

@taskRouter.websocket("/ws/tasks")
async def task_websocket_route(ws: WebSocket):
    return await task_websocket(ws)


@taskRouter.get("/getAllTask",response_model=list[TaskResponse],status_code=200)
async def getAllTask_route(
    request: Request,
    db: AsyncSession = Depends(get_db),
    _:None = Depends(verify_user)
    ):
   return await getAllTask(request, db)

@taskRouter.post("/createTask", response_model=TaskResponse, status_code=201)
async def createTask_route(
    task: TaskCreate,
    db: AsyncSession = Depends(get_db),
    user_id:str = Depends(verify_user)
):
    print(task)
    print(f"*******************  user_id     {user_id}")
    return await createTask(task, db, user_id)

@taskRouter.put("/updateTask/{taskId}", response_model=TaskResponse, status_code=200 )
async def updateTask_Route(
    taskId: str,
    task_data: TaskUpdate,
    db: AsyncSession = Depends(get_db),
     _:None = Depends(verify_user)
):
    return await updateTask(taskId, task_data, db)
