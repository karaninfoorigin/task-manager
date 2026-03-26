import json
import asyncio
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, event: str, task: dict):
        message = json.dumps({
            "event": event,
            "task": task
        })

        coroutines = []
        for connection in self.active_connections:
            coroutines.append(self.safe_send(connection, message))

        await asyncio.gather(*coroutines)

    async def safe_send(self, connection: WebSocket, message: str):
        try:
            await connection.send_text(message)
        except Exception:
            self.disconnect(connection)