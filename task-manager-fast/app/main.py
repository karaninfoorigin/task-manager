from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.config.db import create_tables
from fastapi.middleware.cors import CORSMiddleware
from app.core.middleware import RequestLoggingMiddleware
from app.routes.userRoutes import router
from starlette.middleware.sessions import SessionMiddleware
from app.routes.taskRoutes import taskRouter
# from app.routes.websocketsRoutes import wsRouter
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime
from app.routes.tokenRoutes import tokenRouter
scheduler = AsyncIOScheduler()
def scheduled_task():
    print(f"Task executed at {datetime.now()}")


# scheduler.add_job(scheduled_task, "interval", seconds=5)
@asynccontextmanager
async def lifespan(app:FastAPI):
    print("Initial setup started!")
    scheduler.start()
    print("Scheduler started")
    await create_tables()
    print("Initial setup completed!")
    yield print("Closing the setup!")


app= FastAPI(
    lifespan= lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    SessionMiddleware,
    secret_key='aaaaaaaaaask__Sdde2342'
)

app.include_router(router)
app.include_router(taskRouter)
app.include_router(tokenRouter)
# app.include_router(wsRouter)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code = 500,
        content={"detail":"Internal Server error", "type":type(exc).__name__}
    )

@app.get('/health_check',tags=["hel check"])
async def health_check():
    return {
"status" : "healthy"
    }

    
