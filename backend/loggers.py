import logging
from colorlog import ColoredFormatter

from .settings import get_config

config = get_config()

logging_level = config.get('Server', 'log_level').upper()
string_format = "%(log_color)s%(levelname)-8.8s|%(asctime)s.%(msecs)03d| %(name)-10s| - %(message)s%(reset)s"
date_format = "%Y-%m-%d %H:%M:%S"

formatter = ColoredFormatter(fmt=string_format, datefmt=date_format)
handler = logging.StreamHandler()
handler.setFormatter(formatter)

logging.basicConfig(
    level=logging_level,
    format=string_format,
    datefmt=date_format,
    handlers=[handler]
)

logging.getLogger("asyncio").setLevel(logging.INFO)

main_logger = logging.getLogger("main")
serial_logger = logging.getLogger("serial")
generator = logging.getLogger("generator")

serial_logger.setLevel(logging.INFO)

__all__ = [
    "main_logger",
    "serial_logger"
]
