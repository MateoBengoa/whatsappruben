@echo off
echo 🚀 Iniciando WhatsApp Bot para Ruben - Entorno de Desarrollo
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python no está instalado. Por favor instala Python desde https://python.org/
    pause
    exit /b 1
)

echo ✅ Prerrequisitos verificados
echo.

REM Crear ventana nueva para backend
echo 🐍 Iniciando Backend (Python/FastAPI)...
start "Backend - WhatsApp Bot" cmd /k "cd /d %~dp0\..\backend && python main.py"

REM Esperar un poco
timeout /t 3 /nobreak >nul

REM Crear ventana nueva para frontend web
echo 🌐 Iniciando Frontend Web (Next.js)...
start "Frontend Web - WhatsApp Bot" cmd /k "cd /d %~dp0\..\frontend-web && npm run dev"

REM Esperar un poco
timeout /t 3 /nobreak >nul

REM Crear ventana nueva para frontend móvil
echo 📱 Iniciando Frontend Móvil (Expo)...
start "Frontend Mobile - WhatsApp Bot" cmd /k "cd /d %~dp0\..\frontend-mobile && npx expo start"

echo.
echo ✅ Todos los servicios están iniciando...
echo.
echo 📍 URLs importantes:
echo    - Backend API: http://localhost:8000
echo    - Documentación API: http://localhost:8000/docs
echo    - Frontend Web: http://localhost:3000
echo    - Frontend Móvil: Escanea el QR en la ventana de Expo
echo.
echo 💡 Para detener todos los servicios, cierra las ventanas que se abrieron.
echo.
pause 