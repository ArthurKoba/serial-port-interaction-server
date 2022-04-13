import uvicorn
from backend.settings import get_config

def start() -> None:
    config = get_config()
    print("Starting server...")
    try:
        uvicorn.run(
            app="backend:app",
            port=config.getint('Server', 'port'),
            log_level=config.get('Server', 'log_level'),
            reload_includes=["*.html", '*.js', '*.css'],
            reload=True, debug=True
        )
    except KeyboardInterrupt:
        print("Server closed!")


if __name__ == "__main__":
    start()
