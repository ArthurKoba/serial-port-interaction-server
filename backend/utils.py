from typing import Optional, List

import sys
import glob

from asyncio import gather
from serial_asyncio import open_serial_connection
from serial import SerialException


async def check_serial_port(port: str) -> Optional[str]:
    try:
        reader, writer = await open_serial_connection(url=port)
        writer.close()
        return port
    except (OSError, SerialException):
        pass
    return None

async def get_serial_ports() -> Optional[List[str]]:
    if sys.platform.startswith('win'):
        ports = ['COM%s' % (i + 1) for i in range(256)]
    elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
        # this excludes your current terminal "/dev/tty"
        ports = glob.glob('/dev/tty[A-Za-z]*')
    elif sys.platform.startswith('darwin'):
        ports = glob.glob('/dev/tty.*')
    else:
        raise EnvironmentError('Unsupported platform')

    available_ports = []
    tasks = [check_serial_port(port) for port in ports]
    results = await gather(*tasks)
    for result in results:
        if not result:
            continue
        available_ports.append(result)
    return available_ports
