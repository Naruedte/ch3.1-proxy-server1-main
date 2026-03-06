@echo off
echo [STATUS] Current System Status
echo ========================================================
echo.

echo [CONTAINERS]
docker-compose ps
echo.

echo [NGINX CONFIG TEST]
docker-compose exec nginx nginx -t
echo.

echo [LOGS - Last 20 lines]
docker-compose logs --tail=20
echo.

echo ========================================================
