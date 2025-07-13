# ⚡ Inicio Rápido - WhatsApp Bot para Rubén

## 🚀 Instalación en 3 pasos

### Windows:
```batch
# 1. Clonar proyecto
git clone https://github.com/MateoBengoa/whatsappruben.git
cd whatsappruben

# 2. Instalar automáticamente
scripts\install.bat

# 3. Iniciar todo
scripts\start-dev.bat
```

### Mac/Linux:
```bash
# 1. Clonar proyecto
git clone https://github.com/MateoBengoa/whatsappruben.git
cd whatsappruben

# 2. Instalar automáticamente
chmod +x scripts/*.sh
./scripts/install.sh

# 3. Iniciar todo
./scripts/start-dev.sh
```

## 🔧 Configuración Rápida

### 1. Supabase (Base de Datos)
- Ve a [supabase.com](https://supabase.com) → Crear proyecto
- Copia: URL + anon key + service key
- Ejecuta el SQL del archivo `SETUP_GUIDE.md`

### 2. OpenAI (ChatGPT)
- Ve a [platform.openai.com](https://platform.openai.com)
- Genera API Key
- Agrega método de pago

### 3. Twilio (WhatsApp)
- Ve a [twilio.com](https://twilio.com) → Crear cuenta
- Copia: Account SID + Auth Token
- Activa WhatsApp Sandbox

### 4. Editar archivos de configuración:
- `backend/.env`
- `frontend-web/.env.local`

## 📱 URLs importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Backend API | http://localhost:8000 | API principal |
| Documentación | http://localhost:8000/docs | Swagger/OpenAPI |
| Dashboard Web | http://localhost:3000 | Panel de administración |
| App Móvil | Expo QR | Escanear con Expo Go |

## 🛠️ Comandos útiles

### Desarrollo:
```bash
# Iniciar todo (Windows)
scripts\start-dev.bat

# Iniciar todo (Mac/Linux) 
./scripts/start-dev.sh

# Detener todo (Mac/Linux)
./scripts/stop-dev.sh
```

### Solo Backend:
```bash
cd backend
python main.py
```

### Solo Frontend Web:
```bash
cd frontend-web
npm run dev
```

### Solo Frontend Móvil:
```bash
cd frontend-mobile
npx expo start
```

## 🔍 Solución de problemas

### ❌ Error "node no encontrado"
```bash
# Instalar Node.js desde: https://nodejs.org/
```

### ❌ Error "python no encontrado"
```bash
# Instalar Python desde: https://python.org/
```

### ❌ Error de dependencias
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error de conexión a Supabase
- Verifica URL y keys en `.env`
- Asegúrate que las tablas estén creadas

### ❌ Error de WhatsApp
- Verifica webhook en Twilio Console
- Usa ngrok para exponer puerto 8000

## 🎯 Primeros pasos después de instalación

1. **Probar API**: Ve a http://localhost:8000/docs
2. **Probar Dashboard**: Ve a http://localhost:3000  
3. **Configurar WhatsApp**: Sigue guía de Twilio
4. **Enviar primer mensaje**: Prueba el bot
5. **Personalizar**: Modifica personalidad y respuestas

## 📚 Más información

- **Guía completa**: `SETUP_GUIDE.md`
- **Documentación**: `docs/FEATURES.md`
- **Arquitectura**: `README.md`

¿Problemas? Revisa los logs en cada terminal 🔍 