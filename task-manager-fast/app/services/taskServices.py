from fastapi import  Depends, Request, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.db import get_db
from sqlalchemy.future import select
from app.models.taskModel import Task
from app.models.userModel import User
from app.core.exception import HTTPException
from app.schema.Task import TaskUpdate,TaskCreate
from sqlalchemy.orm import selectinload
from app.core.websocket_manager import ConnectionManager

manager = ConnectionManager()  

# task websocker connection
async def task_websocket(ws: WebSocket):
    await manager.connect(ws)

    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)

# Getting all  task service
async def getAllTask(
    request: Request,
    db: AsyncSession = Depends(get_db)
    ):
    userId = request.state.user_id
    result = await db.execute(select(User).where(User.id == userId))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = await db.execute(
    select(Task).options(selectinload(Task.created_by))
    )

    tasks = result.scalars().all()
    
    return tasks

# Creating new task service
async def createTask( 
    task: TaskCreate,
    db: AsyncSession,
    user_id: str,
):
    print(f"********** inside create task {task}")
    createdTask = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        created_by_id=user_id
    )
    print(f"************************** created task{createdTask}")
    db.add(createdTask)
    await db.commit()
    await db.refresh(createdTask)

    # reload with relationship
    result = await db.execute(
        select(Task)
        .options(selectinload(Task.created_by))
        .where(Task.id == createdTask.id)
    )

    task_with_user = result.scalar_one()
    
    await manager.broadcast(
    "TASK_CREATED",
    {
        "id": createdTask.id,
        "title": createdTask.title,
        "description": createdTask.description,
        "status": createdTask.status
    }
)
    return task_with_user

# Updating Task service
async def updateTask(
    taskId: str,
    task_data: TaskUpdate,
    db: AsyncSession = Depends(get_db)
):
    
    result = await db.execute(
        select(Task).where(Task.id == taskId)
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task, key, value)

    await db.commit()
    await db.refresh(task)

    # reload relationship for response
    result = await db.execute(
        select(Task)
        .options(selectinload(Task.created_by))
        .where(Task.id == task.id)
    )

    updated_task = result.scalar_one()
    await manager.broadcast(
    "TASK_UPDATED",
    {
        "id": updated_task.id,
        "title": updated_task.title,
        "description": updated_task.description,
        "status": updated_task.status
    }
)
    return updated_task
