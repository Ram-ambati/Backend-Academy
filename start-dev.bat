@echo off
setlocal EnableExtensions

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "BACKEND_WRAPPER=%BACKEND_DIR%\mvnw.cmd"
set "FRONTEND_PACKAGE=%FRONTEND_DIR%\package.json"

if not exist "%BACKEND_DIR%" (
    echo [ERROR] Backend directory not found: "%BACKEND_DIR%"
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo [ERROR] Frontend directory not found: "%FRONTEND_DIR%"
    exit /b 1
)

if not exist "%BACKEND_WRAPPER%" (
    echo [ERROR] Maven wrapper not found: "%BACKEND_WRAPPER%"
    exit /b 1
)

if not exist "%FRONTEND_PACKAGE%" (
    echo [ERROR] package.json not found: "%FRONTEND_PACKAGE%"
    exit /b 1
)

where java >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java is not available in PATH. Install JDK 21+ and try again.
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not available in PATH. Install Node.js and try again.
    exit /b 1
)

if not exist "%FRONTEND_DIR%\node_modules" (
    echo [ERROR] Frontend dependencies are missing.
    echo         Run "npm install" inside "%FRONTEND_DIR%" first.
    exit /b 1
)

echo Starting backend and frontend in separate terminals...
start "Backend - Backend Academy" cmd /k "pushd \"%BACKEND_DIR%\" && call \"%BACKEND_WRAPPER%\" spring-boot:run"
start "Frontend - Backend Academy" cmd /k "pushd \"%FRONTEND_DIR%\" && npm run dev"

echo Done.
exit /b 0
