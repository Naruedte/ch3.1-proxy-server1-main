@echo off

cd backend

echo 1. Installing dependencies...
call npm install

echo 2. Generating Prisma Client...
call npx prisma generate

echo 3. Pushing Database Schema to Supabase...
call npx prisma db push

echo Done! Database is ready.
pause
