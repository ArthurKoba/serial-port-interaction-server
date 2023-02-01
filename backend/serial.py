from typing import Optional, Dict, Sequence, Iterable
from asyncio import sleep
from asyncio.streams import StreamReader, StreamWriter
from random import choice
from json import loads

from serial_asyncio import open_serial_connection
from serial.serialutil import SerialException
from serial.tools.list_ports import comports as get_available_com_ports
from serial.tools.list_ports_common import ListPortInfo

from .loggers import serial_logger as logger
from .websockets.manager import WebSocketConnectionManager


class SerialPortManager:
    def __init__(self):
        self._available_ports: Dict[str, ListPortInfo] = {}
        self.load_available_ports()

    def load_available_ports(self) -> None:
        for port in get_available_com_ports():
            self._available_ports.update({port.name: port})
        if len(self._available_ports):
            logger.debug(f"Available ports: {','.join(self._available_ports.keys())}.")
        else:
            logger.debug(f"Available ports: None.")

    def get_names_ports(self) -> Sequence[str]:
        return ",".join(port for port in self._available_ports.keys())

    def get_random_available_port(self) -> str:
        return choice(list(self._available_ports.keys()))

    def __len__(self):
        return len(self._available_ports)

    @property
    def available_ports(self) -> Iterable[str]:
        return self._available_ports.keys()


class SerialManager:
    DEFAULT_DELAY = 1

    def __init__(
            self,
            websocket_manager: WebSocketConnectionManager,
            baudrate: str,
            port: str = None,
            delay: int = None
    ):
        self._port = port
        self._baudrate = baudrate
        self._delay = delay or self.DEFAULT_DELAY
        self._websocket_manager = websocket_manager
        self._is_connected = False
        self._port_manager = SerialPortManager()
        self._reader: Optional[StreamReader] = None
        self._writer: Optional[StreamWriter] = None

    async def start(self, delay: int = 1) -> None:
        logger.info("Start SerialManager")
        while True:
            if self.is_connected:
                await self._read_message()
                continue
            self._port_manager.load_available_ports()
            if self._port:
                await self._create_connection(self._port)
            else:
                self._port = await self._find_port()

    async def _find_port(self) -> Optional[str]:
        if len(self._port_manager):
            return self._port_manager.get_random_available_port()
        logger.debug(f"Find 0 available ports.")
        await sleep(self._delay)

    async def _create_connection(self, port: str) -> None:
        if port not in self._port_manager.available_ports:
            logger.debug(f"Port {port} is not availble")
        try:
            self._reader, self._writer = await open_serial_connection(
                url=port, baudrate=self._baudrate
            )
            logger.info(f'Opened serial connection with "{port}" port!')
            self._is_connected = True
        except SerialException:
            logger.debug(f'Failed open serial connection with "{port}" port!')
            self._is_connected = False
            await sleep(self._delay)

    async def _handle_message(self, msg: bytes) -> None:
        await self._websocket_manager.broadcast(msg)

    async def _read_message(self) -> None:
        try:
            msg = await self._reader.readuntil(b'\n')
            loads(msg)
            await self._handle_message(msg)
            logger.debug(f"{self._port} | {msg}")
        except SerialException:
            self._is_connected = False
        except:
            logger.info(msg)
    @property
    def is_connected(self) -> bool:
        return self._is_connected

    def __del__(self):
        pass
