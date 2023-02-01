from asyncio import get_running_loop
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .settings import get_config
from .loggers import main_logger
from .websockets.manager import WebSocketConnectionManager
from .serial import SerialManager
from .utils import exception_handler
from .generator import Generator

config = get_config()

app = FastAPI()
websocket_manager = WebSocketConnectionManager()
generator = Generator(websocket_manager=websocket_manager)
serial_manager = SerialManager(
    websocket_manager=websocket_manager,
    baudrate=config.get('Serial', 'baudrate'),
    port=config.get('Serial', 'port', fallback=None),
    delay=config.getint('Serial', 'delay_after_error')
)


@app.on_event("startup")
async def start_serial_manager() -> None:
    loop = get_running_loop()
    loop.set_exception_handler(exception_handler)
    main_logger.info("Start Server")
    loop.create_task(serial_manager.start())
    # loop.create_task(generator.start())


app.mount("/static", StaticFiles(directory=config.get('Server', 'static_directory_path')), name="static")
