from asyncio import get_event_loop
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

from .websockets.manager import WebSocketConnectionManager
from .serial import SerialManager
from .settings import get_config

loop = get_event_loop()
config = get_config()

app = FastAPI()
websocket_manager = WebSocketConnectionManager()
serial_manager = SerialManager(
    websocket_manager = websocket_manager,
    baudrate = config.get('Serial', 'baudrate'),
    port = config.get('Serial', 'port', fallback=None)
)

@app.on_event("startup")
def start_serial_manager() -> None:
    loop.create_task(serial_manager.start(delay=config.getint('Serial', 'delay_after_error')))

app.mount("/static", StaticFiles(directory=config.get('Server', 'static_directory_path')), name="static")
