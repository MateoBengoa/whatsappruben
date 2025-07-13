@echo off
echo 📦 Instalación Automática - WhatsApp Bot para Rubén
echo.

REM Verificar prerrequisitos
echo 🔍 Verificando prerrequisitos...

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado
    echo    Descarga e instala desde: https://nodejs.org/
    pause
    exit /b 1
)

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python no está instalado
    echo    Descarga e instala desde: https://python.org/
    pause
    exit /b 1
)

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Git no está instalado
    echo    Descarga e instala desde: https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Todos los prerrequisitos están instalados
echo.

REM Instalar dependencias del backend
echo 🐍 Instalando dependencias del backend...
cd /d %~dp0\..\backend
if not exist .env (
    echo 📝 Copiando archivo de configuración del backend...
    copy .env.example .env
    echo ⚠️  IMPORTANTE: Edita el archivo backend\.env con tus credenciales reales
)

echo 📦 Instalando paquetes de Python...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ⚠️  Error instalando con pip global, intentando con entorno virtual...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
)

echo.

REM Instalar dependencias del frontend web
echo 🌐 Instalando dependencias del frontend web...
cd /d %~dp0\..\frontend-web
if not exist .env.local (
    echo 📝 Copiando archivo de configuración del frontend web...
    copy .env.example .env.local
    echo ⚠️  IMPORTANTE: Edita el archivo frontend-web\.env.local con tus credenciales reales
)

echo 📦 Instalando paquetes de Node.js para frontend web...
npm install

echo.

REM Instalar dependencias del frontend móvil
echo 📱 Instalando dependencias del frontend móvil...
cd /d %~dp0\..\frontend-mobile

echo 📦 Instalando paquetes de Node.js para frontend móvil...
npm install

echo 📱 Instalando Expo CLI globalmente...
npm install -g @expo/cli

echo.
echo ✅ ¡Instalación completada!
echo.
echo 📋 Próximos pasos:
echo    1. Configura tus servicios externos (Supabase, OpenAI, Twilio)
echo    2. Edita los archivos .env con tus credenciales:
echo       - backend\.env
echo       - frontend-web\.env.local
echo    3. Ejecuta: scripts\start-dev.bat para iniciar todo
echo.
echo 📖 Lee SETUP_GUIDE.md para instrucciones detalladas
echo.
pause 