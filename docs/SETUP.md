# 🚀 Guía de Configuración - Bot WhatsApp Rubén

## 📋 Requisitos Previos

### Software Necesario
- **Node.js** >= 18.0.0
- **Python** >= 3.8
- **npm** o **yarn**
- **Git**

### Cuentas de Servicios
- **OpenAI** - Para la inteligencia artificial
- **Supabase** - Base de datos y autenticación
- **Twilio** - Integración de WhatsApp
- **Render.com** - Despliegue del backend
- **Vercel** - Despliegue del frontend web
- **Apple Developer Account** - Para TestFlight (iOS)

## 🔧 Configuración de Servicios

### 1. OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta y obtén tu API key
3. Asegúrate de tener créditos disponibles
4. Guarda tu `OPENAI_API_KEY`

### 2. Supabase

1. Crea un proyecto en [Supabase](https://supabase.com/)
2. Ve a Settings > API
3. Copia:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_KEY`
   - `service_role` → `SUPABASE_SERVICE_KEY`
4. En el SQL Editor, ejecuta el script `shared/supabase_schema.sql`

### 3. Twilio

1. Crea una cuenta en [Twilio](https://www.twilio.com/)
2. Ve a Console Dashboard
3. Copia:
   - `Account SID` → `TWILIO_ACCOUNT_SID`
   - `Auth Token` → `TWILIO_AUTH_TOKEN`
4. Configura WhatsApp Sandbox:
   - Ve a Messaging > Try it out > Send a WhatsApp message
   - Sigue las instrucciones para activar el sandbox
   - Copia el número de WhatsApp → `TWILIO_WHATSAPP_NUMBER`

### 4. Render.com

1. Crea una cuenta en [Render](https://render.com/)
2. Conecta tu repositorio GitHub
3. Usa el archivo `backend/render.yaml` para configuración automática

### 5. Vercel

1. Crea una cuenta en [Vercel](https://vercel.com/)
2. Conecta tu repositorio GitHub
3. Configura las variables de entorno del frontend

## ⚙️ Instalación Local

### Backend (Python/FastAPI)

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus valores reales
# (Ver sección de variables de entorno abajo)

# Ejecutar servidor de desarrollo
uvicorn main:app --reload
```

### Frontend Web (Next.js)

```bash
cd frontend-web

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Editar .env.local con tus valores
# (Ver sección de variables de entorno abajo)

# Ejecutar servidor de desarrollo
npm run dev
```

### Frontend Móvil (React Native/Expo)

```bash
cd frontend-mobile

# Instalar dependencias
npm install

# Instalar Expo CLI globalmente
npm install -g @expo/cli

# Iniciar desarrollo
expo start

# Para iOS (requiere Xcode en Mac)
expo start --ios

# Para Android (requiere Android Studio)
expo start --android
```

## 🔐 Variables de Entorno

### Backend (.env)

```env
# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# API
API_SECRET_KEY=your-jwt-secret-key-generate-strong-one
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=development
DEBUG=True

# Webhook
WEBHOOK_URL=https://your-app.onrender.com/webhook/whatsapp
```

### Frontend Web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Frontend Móvil

Las variables se configuran en `app.config.js` o directamente en el código.

## 🌐 Despliegue a Producción

### 1. Backend en Render.com

1. Conecta tu repositorio en Render
2. Selecciona el directorio `backend`
3. Configura las variables de entorno en el dashboard
4. Render usará automáticamente `render.yaml`

### 2. Frontend Web en Vercel

1. Conecta tu repositorio en Vercel
2. Selecciona el directorio `frontend-web`
3. Configura las variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. App Móvil con EAS

```bash
cd frontend-mobile

# Instalar EAS CLI
npm install -g eas-cli

# Login a Expo
eas login

# Configurar proyecto
eas build:configure

# Build para iOS
eas build --platform ios

# Submit a TestFlight
eas submit --platform ios
```

## 🔗 Configuración de Webhook

### En Twilio

1. Ve a Messaging > Settings > WhatsApp Sandbox Settings
2. En "When a message comes in", ingresa:
   ```
   https://your-app.onrender.com/webhook/whatsapp
   ```
3. Método: `POST`

### Verificar Webhook

```bash
# Probar que el webhook responde
curl -X POST https://your-app.onrender.com/webhook/whatsapp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "Body=test&From=whatsapp:+123456789&To=whatsapp:+14155238886&MessageSid=test"
```

## 📱 Configuración de WhatsApp Business

Para producción, necesitarás aprobar tu número de WhatsApp Business:

1. Ve a [WhatsApp Business API](https://business.whatsapp.com/)
2. Solicita acceso al API
3. Completa el proceso de verificación
4. Actualiza la configuración en Twilio

## 🧪 Testing

### Test del Backend

```bash
cd backend
python -m pytest tests/
```

### Test del Frontend Web

```bash
cd frontend-web
npm run test
```

### Test de la API

1. Ve a `http://localhost:8000/docs` para ver la documentación de la API
2. Usa el endpoint `/api/test-ai-response` para probar respuestas sin enviar mensajes

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error de autenticación con Supabase**
   - Verifica que las URLs y keys sean correctas
   - Asegúrate de que RLS esté configurado correctamente

2. **Twilio no recibe mensajes**
   - Verifica que el webhook esté configurado correctamente
   - Revisa los logs en Render.com

3. **La IA no responde**
   - Verifica tu API key de OpenAI
   - Revisa que tengas créditos disponibles
   - Comprueba los logs del servidor

4. **Build de React Native falla**
   - Asegúrate de tener las versiones correctas de Node.js y Expo CLI
   - Limpia caché: `expo r -c`

### Logs y Debugging

```bash
# Backend logs (en desarrollo)
uvicorn main:app --reload --log-level debug

# Frontend logs
npm run dev

# Expo logs
expo start --clear
```

## 📞 Soporte

Para problemas o preguntas:

1. Revisa los logs de cada servicio
2. Verifica la configuración de variables de entorno
3. Consulta la documentación de cada servicio (Twilio, OpenAI, Supabase)

## 🚀 ¡Listo!

Una vez configurado todo correctamente:

1. Los mensajes de WhatsApp llegarán a tu webhook
2. La IA responderá automáticamente como Rubén
3. Podrás administrar todo desde el panel web o la app móvil
4. Los datos se almacenarán en Supabase con memoria por contacto

¡Tu bot de WhatsApp está listo para transformar la experiencia de tus clientes con la personalidad de Rubén! 💪🔥 