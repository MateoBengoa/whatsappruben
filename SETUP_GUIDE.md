# 🚀 Guía Completa de Instalación - WhatsApp Bot para Rubén

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18+): [Descargar aquí](https://nodejs.org/)
- **Python** (versión 3.8+): [Descargar aquí](https://www.python.org/)
- **Git**: [Descargar aquí](https://git-scm.com/)

## 🔧 Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/MateoBengoa/whatsappruben.git
cd whatsappruben
```

## 🌐 Paso 2: Configurar Servicios Externos

### 2.1 Crear Cuenta en Supabase (Base de Datos)

1. Ve a [Supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crear un nuevo proyecto:
   - Nombre: `whatsapp-bot-ruben`
   - Base de datos password: (guarda esta contraseña)
   - Región: closest to your location

4. Una vez creado, ve a `Settings > API`:
   - Copia la **URL** del proyecto
   - Copia la **anon public key**
   - Copia la **service_role key** (⚠️ mantén esto secreto)

5. Ve a `SQL Editor` y ejecuta este script para crear las tablas:

```sql
-- Crear tabla de contactos
CREATE TABLE contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255),
    last_interaction TIMESTAMP DEFAULT NOW(),
    conversation_context JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de mensajes
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID REFERENCES contacts(id),
    direction VARCHAR(10) CHECK (direction IN ('incoming', 'outgoing')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    message_type VARCHAR(20) DEFAULT 'text',
    processed BOOLEAN DEFAULT false
);

-- Crear tabla de configuración de AI
CREATE TABLE ai_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    personality TEXT DEFAULT 'Eres Rubén, un entrenador personal profesional y amigable.',
    response_delay_min INTEGER DEFAULT 2,
    response_delay_max INTEGER DEFAULT 8,
    max_context_messages INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de datos de entrenamiento
CREATE TABLE training_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar configuración inicial de AI
INSERT INTO ai_config (personality, response_delay_min, response_delay_max) VALUES 
('Eres Rubén, un entrenador personal profesional, motivador y amigable. Ayudas a las personas con rutinas de ejercicio, nutrición y motivación. Siempre respondes en español de manera cercana y alentadora.', 3, 7);

-- Insertar algunos datos de entrenamiento iniciales
INSERT INTO training_data (category, question, answer, tags) VALUES 
('saludo', '¡Hola!', '¡Hola! 👋 Soy Rubén, tu entrenador personal. ¿En qué puedo ayudarte hoy? ¿Quieres empezar una rutina, necesitas consejos de nutrición o tienes alguna pregunta sobre fitness?', ARRAY['saludo', 'presentacion']),
('rutina', '¿Qué ejercicios puedo hacer en casa?', 'Te recomiendo empezar con estos ejercicios básicos que puedes hacer en casa:\n\n💪 **Ejercicios de fuerza:**\n- Flexiones (3 series de 10-15)\n- Sentadillas (3 series de 15-20)\n- Plancha (3 series de 30-60 segundos)\n\n🏃 **Cardio:**\n- Jumping jacks (3 series de 30 segundos)\n- Burpees (2 series de 5-10)\n\n¿Te gustaría que personalice una rutina específica para ti?', ARRAY['rutina', 'ejercicios', 'casa']),
('nutricion', '¿Qué debo comer antes del ejercicio?', 'Excelente pregunta! 🍎 Para antes del ejercicio te recomiendo:\n\n**30-60 minutos antes:**\n- Una banana con mantequilla de maní\n- Avena con frutas\n- Tostada integral con aguacate\n\n**15-30 minutos antes:**\n- Una fruta (banana, manzana)\n- Puñado de dátiles\n\nEvita comidas pesadas 2 horas antes del entrenamiento. ¿Tienes alguna preferencia alimentaria específica?', ARRAY['nutricion', 'pre-entreno', 'alimentacion']);
```

### 2.2 Configurar OpenAI (GPT-4)

1. Ve a [OpenAI.com](https://openai.com)
2. Crea una cuenta o inicia sesión
3. Ve a [API Keys](https://platform.openai.com/api-keys)
4. Crea una nueva API key:
   - Nombre: `whatsapp-bot-ruben`
   - ⚠️ **Copia y guarda esta key inmediatamente (no la volverás a ver)**
5. Ve a [Billing](https://platform.openai.com/account/billing) y agrega un método de pago
6. Establece un límite de gasto mensual (recomendado: $20-50)

### 2.3 Configurar Twilio WhatsApp

1. Ve a [Twilio.com](https://twilio.com)
2. Crea una cuenta gratuita
3. Verifica tu número de teléfono
4. Ve al [Console Dashboard](https://console.twilio.com/)
5. Copia tu **Account SID** y **Auth Token**
6. Ve a `Messaging > Try it out > Send a WhatsApp message`
7. Sigue las instrucciones para activar WhatsApp Sandbox
8. El número de Twilio WhatsApp será: `whatsapp:+14155238886`

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 Backend (Python/FastAPI)

```bash
cd backend
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales reales:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-tu-api-key-aqui

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=tu-account-sid-aqui
TWILIO_AUTH_TOKEN=tu-auth-token-aqui
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Supabase Database Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-service-role-key-aqui

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# Security
SECRET_KEY=tu-clave-secreta-super-segura-aqui
```

### 3.2 Frontend Web (Next.js)

```bash
cd ../frontend-web
cp .env.example .env.local
```

Edita el archivo `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Configuration (usa las mismas de Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Environment
NODE_ENV=development
```

## 📦 Paso 4: Instalar Dependencias

### 4.1 Backend

```bash
cd backend
pip install -r requirements.txt
```

Si tienes problemas, usa un entorno virtual:

```bash
python -m venv venv
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 4.2 Frontend Web

```bash
cd ../frontend-web
npm install
```

### 4.3 Frontend Móvil

```bash
cd ../frontend-mobile
npm install
```

Para desarrollo móvil, también instala Expo CLI:

```bash
npm install -g @expo/cli
```

## 🚀 Paso 5: Ejecutar el Sistema

### 5.1 Iniciar el Backend (Terminal 1)

```bash
cd backend
python main.py
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 5.2 Iniciar Frontend Web (Terminal 2)

```bash
cd frontend-web
npm run dev
```

Deberías ver:
```
Next.js 14.0.0
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

### 5.3 Iniciar Frontend Móvil (Terminal 3)

```bash
cd frontend-mobile
npx expo start
```

Deberías ver un QR code para escanear con la app Expo Go.

## 🔧 Paso 6: Configurar Webhook de Twilio

1. Ve a [ngrok.com](https://ngrok.com) y crea una cuenta gratuita
2. Descarga e instala ngrok
3. En una nueva terminal, ejecuta:

```bash
ngrok http 8000
```

4. Copia la URL HTTPS que te da ngrok (ej: `https://abc123.ngrok.io`)
5. Ve a tu [Twilio Console](https://console.twilio.com/)
6. Ve a `Messaging > Settings > WhatsApp sandbox settings`
7. En "When a message comes in", pon: `https://abc123.ngrok.io/webhook/whatsapp`
8. Método: `POST`
9. Guarda la configuración

## ✅ Paso 7: Probar el Sistema

### 7.1 Probar Backend

Ve a: http://localhost:8000/docs

Deberías ver la documentación automática de la API.

### 7.2 Probar Frontend Web

Ve a: http://localhost:3000

Deberías ver el dashboard de administración.

### 7.3 Probar WhatsApp Bot

1. Envía un mensaje WhatsApp al número de Twilio desde tu teléfono
2. Primero envía: `join <código>` (el código que te dio Twilio)
3. Luego envía: "¡Hola!"
4. Deberías recibir una respuesta del bot

### 7.4 Probar App Móvil

1. Instala "Expo Go" en tu teléfono
2. Escanea el QR code que aparece en la terminal
3. La app debería abrirse y mostrar el dashboard móvil

## 🔍 Solución de Problemas Comunes

### Error de conexión a Supabase
- Verifica que las URLs y keys sean correctas
- Asegúrate de que las tablas estén creadas
- Revisa que el proyecto de Supabase esté activo

### Error de OpenAI
- Verifica que tu API key sea válida
- Asegúrate de tener crédito en tu cuenta
- Verifica que tengas acceso a GPT-4

### Error de Twilio
- Verifica tu Account SID y Auth Token
- Asegúrate de que el webhook esté configurado correctamente
- Verifica que ngrok esté corriendo

### Error de instalación de dependencias
- Actualiza Node.js a la versión más reciente
- Limpia la caché: `npm cache clean --force`
- Elimina node_modules y reinstala: `rm -rf node_modules && npm install`

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. **Personaliza el bot**: Modifica la personalidad en Supabase
2. **Agrega datos de entrenamiento**: Usa la interfaz web para agregar más Q&As
3. **Invita contactos**: Comparte tu número de WhatsApp de Twilio
4. **Monitorea**: Usa el dashboard para ver estadísticas
5. **Despliega en producción**: Sigue las guías de deployment en la documentación

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en cada terminal
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que todos los servicios estén corriendo
4. Consulta la documentación de cada servicio (Supabase, OpenAI, Twilio)

¡Tu WhatsApp Bot está listo para ayudar a tus clientes! 🎉 