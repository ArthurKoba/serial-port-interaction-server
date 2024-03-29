import uvicorn
from backend.settings import get_config


def start() -> None:
    config = get_config()
    uvicorn.run(
        app="backend:app",
        port=config.getint('Server', 'port'),
        log_level="warning",
        reload_includes=["*.html", '*.js', '*.css'],
        reload=True,
        ws_ping_interval=10,
        ws_ping_timeout=10
    )


if __name__ == "__main__":
    start()
