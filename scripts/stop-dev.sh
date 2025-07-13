#!/bin/bash

echo "🛑 Deteniendo WhatsApp Bot para Rubén..."
echo

# Obtener directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." &> /dev/null && pwd )"

# Función para detener un servicio
stop_service() {
    local name=$1
    local pid_file="$PROJECT_DIR/logs/${name,,}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🔄 Deteniendo $name (PID: $pid)..."
            kill $pid
            sleep 2
            
            # Si todavía está corriendo, forzar
            if ps -p $pid > /dev/null 2>&1; then
                echo "   Forzando detención de $name..."
                kill -9 $pid
            fi
            
            echo "✅ $name detenido"
        else
            echo "⚠️  $name ya estaba detenido"
        fi
        rm -f "$pid_file"
    else
        echo "⚠️  No se encontró archivo PID para $name"
    fi
}

# Detener todos los servicios
stop_service "Backend"
stop_service "Frontend-Web" 
stop_service "Frontend-Mobile"

# Limpiar archivos temporales
echo
echo "🧹 Limpiando archivos temporales..."
rm -rf "$PROJECT_DIR/logs"

echo
echo "✅ Todos los servicios han sido detenidos"
echo 