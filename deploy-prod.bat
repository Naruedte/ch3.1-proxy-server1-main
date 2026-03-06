@echo off
echo [DEPLOY-PROD] WARNING: This will deploy to PRODUCTION environment.
echo [DEPLOY-PROD] Press Ctrl+C to cancel or any key to continue...
pause

echo [DEPLOY-PROD] Building...
cd frontend
call npm ci
call npx quasar build
cd ..

echo [DEPLOY-PROD] Deploying with Production Configuration...
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --remove-orphans

echo [DEPLOY-PROD] Waiting for health checks...
timeout /t 10

echo [DEPLOY-PROD] Status:
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps -a

echo [SUCCESS] Production deployment complete.
