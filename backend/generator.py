from asyncio import sleep, timeout
from json import dumps
from math import sin
from time import time

from .loggers import generator as logger
from .websockets.manager import WebSocketConnectionManager


class Generator:
    DEFAULT_DELAY = 0.015

    def __init__(self, websocket_manager: WebSocketConnectionManager):
        self.websocket_manager = websocket_manager
        self.index = 0
        self.data: list[int] = [abs(int(sin(i)*100)) for i in range(2048)]

    def generate_data(self) -> dict:
        self.data.pop(0)
        self.data.append(abs(sin(self.index/10)*1000))
        self.index += 1
        return {"dataType" : "fft", "data": self.data}

    async def generate_and_send_data(self) -> None:
        data = dumps(self.generate_data())
        await self.websocket_manager.broadcast(data)
        t = round(time() - self.start_time, 2)
        logger.info(t)
        await self.websocket_manager.broadcast(f"-[{t}]")

    async def start(self) -> None:
        logger.info("start generator")
        self.start_time = time()
        while True:
            async with timeout(1):
                await self.generate_and_send_data()
            await sleep(self.DEFAULT_DELAY)
