@echo off
echo [DEPLOY] Starting deployment...

:: 1. Build first
call build.bat
if %errorlevel% neq 0 (
    echo [ERROR] Build failed. Aborting deployment.
    exit /b %errorlevel%
)

:: 2. Stop existing containers
echo [DEPLOY] Stopping existing containers...
docker-compose down

:: 3. Start new containers
echo [DEPLOY] Starting containers...
docker-compose up -d --remove-orphans

:: 4. Check status
echo [DEPLOY] Checking status...
timeout /t 5
docker-compose ps

echo [SUCCESS] Application deployed! Access at http://localhost
