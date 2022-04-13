from typing import Optional, List
from asyncio import sleep
from serial_asyncio import open_serial_connection
from serial.serialutil import SerialException

from .websockets.manager import WebSocketConnectionManager
from .utils import get_serial_ports

class SerialManager:

    _is_connected = False

    def __init__(self, websocket_manager: WebSocketConnectionManager,
                      baudrate: str, port: Optional[str] = None):
        self._port = port
        self._baudrate = baudrate
        self._websocket_manager = websocket_manager

    async def start(self, delay: int = 1) -> None:
        while True:
            if self.is_connected:
                await self.__read_message()
            elif self._port:
                await self.__create_connection(self._port)
                if not self.is_connected:
                    print(f"Failed to connect to port '{self._port}'")
                    await sleep(delay)
            else:
                await self.__find_port()
                if not self.is_connected:
                    print(f"Wait serial port connection", end='\r')
                    await sleep(delay)

    async def __find_port(self) -> None:
        ports = await get_serial_ports()
        while ports and not self.is_connected:
            await self.__create_connection(ports.pop(0))


    async def __create_connection(self, port: str) -> None:
        try:
            self._reader, self._writer = await open_serial_connection(
                url=port, baudrate=self._baudrate
            )
            print(f'Opened serial connection with "{port}" port!')
            self._is_connected = True
        except SerialException:
            self._is_connected = False


    async def __handle_message(self, msg: str) -> None:
        await self._websocket_manager.broadcast(msg)


    async def __read_message(self) -> None:
        try:
            msg = await self._reader.readuntil(b'\n')
            await self.__handle_message(msg)
        except SerialException as e:
            self._is_connected = False


    @property
    def is_connected(self) -> bool:
        if self._is_connected:
            return True
        return False
