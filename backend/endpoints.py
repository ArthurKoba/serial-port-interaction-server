from fastapi.responses import HTMLResponse, JSONResponse

from .core import app, config


@app.get("/", response_class=HTMLResponse)
def get_index_page() -> HTMLResponse:
    try:
        with open(config.get('Server', 'index_file_path')) as f:
            content = f.read()
            return HTMLResponse(content=content, status_code=200)
    except FileNotFoundError:
        return HTMLResponse(content=None, status_code=404)

@app.get("/ping", response_class=JSONResponse)
def ping() -> JSONResponse:
    return JSONResponse(content={'status': True}, status_code=200)
