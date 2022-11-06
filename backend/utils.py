from asyncio import AbstractEventLoop
from serial.serialutil import SerialException
from websockets.exceptions import ConnectionClosedOK


def exception_handler(loop: AbstractEventLoop, context):
    exception = context.get("exception")
    if type(exception) in (SerialException, ConnectionClosedOK):
        return
