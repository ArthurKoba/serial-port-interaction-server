@echo off
set venv=venv

cd /D "%~dp0"
echo Project Directory: %~dp0

IF NOT EXIST "%~dp0%venv%" (
    echo Virtual Environment Directory not found. Create...
    python -m venv %venv%
    %venv%\Scripts\activate
    echo Install Dependencies...
    pip install -r requirements.txt
    python start.py
) ELSE (
    %venv%\Scripts\activate.bat
    python start.py
)