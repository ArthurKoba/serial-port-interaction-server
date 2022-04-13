from fastapi import WebSocket, WebSocketDisconnect

from ..core import app, websocket_manager

@app.websocket("/serial")
async def websocket_endpoint_serial(websocket: WebSocket) -> None:
    await websocket_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Getted Data: {data}")
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)

@app.websocket("/server")
async def websocket_endpoint_server(websocket: WebSocket) -> None:
    try:
        await websocket.accept()
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Getted Data: {data}")
    except WebSocketDisconnect:
        pass
