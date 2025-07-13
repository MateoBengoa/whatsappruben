#!/bin/bash

echo "🚀 Iniciando WhatsApp Bot para Rubén - Entorno de Desarrollo"
echo

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Error: Python no está instalado. Por favor instala Python desde https://python.org/"
    exit 1
fi

echo "✅ Prerrequisitos verificados"
echo

# Obtener directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." &> /dev/null && pwd )"

# Función para iniciar servicios en segundo plano
start_service() {
    local name=$1
    local dir=$2
    local cmd=$3
    
    echo "🔄 Iniciando $name..."
    cd "$PROJECT_DIR/$dir"
    
    # Crear archivo de log para cada servicio
    mkdir -p "$PROJECT_DIR/logs"
    local log_file="$PROJECT_DIR/logs/${name,,}.log"
    
    # Ejecutar comando en segundo plano y redirigir salida a log
    eval "$cmd" > "$log_file" 2>&1 &
    local pid=$!
    
    # Guardar PID para poder detener después
    echo $pid > "$PROJECT_DIR/logs/${name,,}.pid"
    
    echo "✅ $name iniciado (PID: $pid)"
    echo "   Log: $log_file"
}

# Iniciar Backend
start_service "Backend" "backend" "python main.py"

# Esperar un poco
sleep 3

# Iniciar Frontend Web
start_service "Frontend-Web" "frontend-web" "npm run dev"

# Esperar un poco
sleep 3

# Iniciar Frontend Móvil
start_service "Frontend-Mobile" "frontend-mobile" "npx expo start"

echo
echo "✅ Todos los servicios están iniciando..."
echo
echo "📍 URLs importantes:"
echo "   - Backend API: http://localhost:8000"
echo "   - Documentación API: http://localhost:8000/docs"
echo "   - Frontend Web: http://localhost:3000"
echo "   - Frontend Móvil: Escanea el QR en el log de expo"
echo
echo "📋 Para ver los logs en tiempo real:"
echo "   - Backend: tail -f $PROJECT_DIR/logs/backend.log"
echo "   - Frontend Web: tail -f $PROJECT_DIR/logs/frontend-web.log"
echo "   - Frontend Móvil: tail -f $PROJECT_DIR/logs/frontend-mobile.log"
echo
echo "🛑 Para detener todos los servicios: ./scripts/stop-dev.sh"
echo

# Mantener el script corriendo
echo "Presiona Ctrl+C para salir..."
wait 