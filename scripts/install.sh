#!/bin/bash

echo "📦 Instalación Automática - WhatsApp Bot para Rubén"
echo

# Verificar prerrequisitos
echo "🔍 Verificando prerrequisitos..."

if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "   Descarga e instala desde: https://nodejs.org/"
    exit 1
fi

if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Error: Python no está instalado"
    echo "   Descarga e instala desde: https://python.org/"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Error: Git no está instalado"
    echo "   Instala con: sudo apt install git (Ubuntu) o brew install git (Mac)"
    exit 1
fi

echo "✅ Todos los prerrequisitos están instalados"
echo

# Obtener directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." &> /dev/null && pwd )"

# Instalar dependencias del backend
echo "🐍 Instalando dependencias del backend..."
cd "$PROJECT_DIR/backend"

if [ ! -f ".env" ]; then
    echo "📝 Copiando archivo de configuración del backend..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo backend/.env con tus credenciales reales"
fi

echo "📦 Instalando paquetes de Python..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
else
    PYTHON_CMD="python"
    PIP_CMD="pip"
fi

# Intentar instalar directamente
$PIP_CMD install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "⚠️  Error instalando con pip global, creando entorno virtual..."
    $PYTHON_CMD -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
fi

echo

# Instalar dependencias del frontend web
echo "🌐 Instalando dependencias del frontend web..."
cd "$PROJECT_DIR/frontend-web"

if [ ! -f ".env.local" ]; then
    echo "📝 Copiando archivo de configuración del frontend web..."
    cp .env.example .env.local
    echo "⚠️  IMPORTANTE: Edita el archivo frontend-web/.env.local con tus credenciales reales"
fi

echo "📦 Instalando paquetes de Node.js para frontend web..."
npm install

echo

# Instalar dependencias del frontend móvil
echo "📱 Instalando dependencias del frontend móvil..."
cd "$PROJECT_DIR/frontend-mobile"

echo "📦 Instalando paquetes de Node.js para frontend móvil..."
npm install

echo "📱 Instalando Expo CLI globalmente..."
npm install -g @expo/cli

# Hacer ejecutables los scripts
echo "🔧 Configurando permisos de scripts..."
chmod +x "$PROJECT_DIR/scripts"/*.sh

echo
echo "✅ ¡Instalación completada!"
echo
echo "📋 Próximos pasos:"
echo "   1. Configura tus servicios externos (Supabase, OpenAI, Twilio)"
echo "   2. Edita los archivos .env con tus credenciales:"
echo "      - backend/.env"
echo "      - frontend-web/.env.local"
echo "   3. Ejecuta: ./scripts/start-dev.sh para iniciar todo"
echo
echo "📖 Lee SETUP_GUIDE.md para instrucciones detalladas"
echo 