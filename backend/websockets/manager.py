from typing import List
from asyncio import gather
from fastapi import WebSocket
from websockets.exceptions import ConnectionClosedError

class WebSocketConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket) -> None:
        await websocket.send_text(message)

    async def broadcast(self, message: str) -> None:
        tasks = [
                self.send_personal_message(message, websocket)
                for websocket in self.active_connections
        ]
        try:
            await gather(*tasks)
        except Exception:
            pass
