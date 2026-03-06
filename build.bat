@echo off
echo [BUILD] Starting build process...

:: 1. Build Frontend
echo [BUILD] Building Frontend (Quasar)...
cd frontend
call npm install
call npx quasar build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    cd ..
    exit /b %errorlevel%
)
cd ..

:: 2. Build Docker Images
echo [BUILD] Building Docker images...
docker-compose build
if %errorlevel% neq 0 (
    echo [ERROR] Docker build failed!
    exit /b %errorlevel%
)

echo [SUCCESS] Build completed successfully!
