# 🚀 Guía Completa: WhatsApp Bot para Rubén

Esta es la guía maestra para poner en funcionamiento todo el sistema WhatsApp Bot. Sigue los pasos en orden para obtener un sistema completamente funcional.

## 🎯 Objetivo Final
Al completar esta guía tendrás:
- ✅ Bot de WhatsApp funcionando con GPT-4
- ✅ Dashboard web para gestionar el bot
- ✅ App móvil para control remoto
- ✅ Base de datos en la nube
- ✅ Todo desplegado en producción

---

## 📋 FASE 1: PREPARACIÓN (30 minutos)

### ✅ 1.1 Clonar el Proyecto
```bash
git clone https://github.com/MateoBengoa/whatsappruben.git
cd whatsappruben
```

### ✅ 1.2 Crear Cuentas Necesarias
Crea cuentas en estos servicios (gratis para empezar):

1. **[Supabase](https://supabase.com)** - Base de datos
2. **[OpenAI](https://platform.openai.com)** - GPT-4 API
3. **[Twilio](https://www.twilio.com)** - WhatsApp API
4. **[Render](https://render.com)** - Backend hosting
5. **[Vercel](https://vercel.com)** - Frontend hosting

---

## 🗄️ FASE 2: CONFIGURAR BASE DE DATOS (20 minutos)

### ✅ 2.1 Configurar Supabase
1. Crea un nuevo proyecto en Supabase
2. Ve a **SQL Editor** y ejecuta `shared/supabase_schema.sql`
3. Ve a **Settings > API** y guarda:
   - Project URL
   - API Key (anon)
   - API Key (service_role)

**📖 Guía detallada**: `docs/CONFIGURACION_SUPABASE.md`

---

## 🤖 FASE 3: CONFIGURAR APIS EXTERNAS (15 minutos)

### ✅ 3.1 OpenAI (GPT-4)
1. Ve a OpenAI Platform
2. Crea una API Key
3. Configura billing (mínimo $5)
4. Guarda la clave: `sk-proj-xxxx`

### ✅ 3.2 Twilio (WhatsApp)
1. Crea cuenta en Twilio
2. Ve a **WhatsApp Sandbox**
3. Únete al sandbox desde tu teléfono
4. Guarda credenciales:
   - Account SID
   - Auth Token

**📖 Guías detalladas**: 
- `docs/CONFIGURACION_OPENAI.md`
- `docs/CONFIGURACION_TWILIO.md`

---

## 🌐 FASE 4: DESPLEGAR BACKEND (20 minutos)

### ✅ 4.1 Render - Backend
1. Conecta GitHub a Render
2. Crea **Web Service** desde tu repo
3. Configuración:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Variables de entorno**:
```env
OPENAI_API_KEY=sk-proj-tu-clave
TWILIO_ACCOUNT_SID=ACtu-sid
TWILIO_AUTH_TOKEN=tu-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-service-role-key
SECRET_KEY=genera-una-clave-secreta
DEBUG=False
```

5. Despliega y copia la URL: `https://tu-app.onrender.com`

### ✅ 4.2 Configurar Webhook en Twilio
1. Ve a Twilio > WhatsApp Sandbox Settings
2. En "When a message comes in":
   ```
   https://tu-app.onrender.com/webhook/whatsapp
   ```

**📖 Guía detallada**: `docs/DESPLIEGUE_RENDER.md`

---

## ⚡ FASE 5: DESPLEGAR FRONTEND WEB (15 minutos)

### ✅ 5.1 Vercel - Frontend Web
1. Conecta GitHub a Vercel
2. Importa tu repositorio
3. Configuración:
   - **Root Directory**: `frontend-web`
   - **Framework**: Next.js

4. **Variables de entorno**:
```env
NEXT_PUBLIC_API_URL=https://tu-app.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NODE_ENV=production
```

5. Despliega y copia la URL: `https://tu-app.vercel.app`

**📖 Guía detallada**: `docs/DESPLIEGUE_VERCEL.md`

---

## 📱 FASE 6: CONFIGURAR APP MÓVIL (25 minutos)

### ✅ 6.1 Instalar Herramientas
```bash
npm install -g @expo/cli eas-cli
```

### ✅ 6.2 Configurar Proyecto Móvil
```bash
cd frontend-mobile
npm install
npx expo login
```

### ✅ 6.3 Actualizar URL de API
En `frontend-mobile/lib/api.ts`:
```typescript
const API_BASE_URL = 'https://tu-app.onrender.com';
```

### ✅ 6.4 Probar en Desarrollo
```bash
npx expo start
```
- Instala "Expo Go" en tu teléfono
- Escanea el QR para probar

**📖 Guía detallada**: `docs/CONFIGURACION_MOBILE.md`

---

## 🧪 FASE 7: PRUEBAS Y VERIFICACIÓN (15 minutos)

### ✅ 7.1 Prueba el Bot de WhatsApp
1. Desde tu teléfono, envía un mensaje al sandbox de Twilio
2. Debe responder con GPT-4
3. Verifica que guarde la conversación

### ✅ 7.2 Prueba el Dashboard Web
1. Ve a tu URL de Vercel
2. Verifica estadísticas
3. Prueba enviar mensajes de prueba
4. Revisa la configuración del AI

### ✅ 7.3 Prueba la App Móvil
1. Abre la app en Expo Go
2. Navega por todas las pantallas
3. Verifica que cargue datos del backend

---

## 🎉 FASE 8: PUESTA EN PRODUCCIÓN (10 minutos)

### ✅ 8.1 Configuración Final
1. Actualiza prompts del AI según tu negocio
2. Configura horarios de respuesta
3. Agrega contactos de prueba

### ✅ 8.2 Monitoreo
1. Configura alertas en Render
2. Monitorea logs de errores
3. Revisa uso de OpenAI

### ✅ 8.3 Documentación para Usuarios
1. Crea instructivos para clientes
2. Define flujos de conversación
3. Establece límites y expectativas

---

## 📊 RESULTADOS ESPERADOS

Después de completar todos los pasos tendrás:

### 🤖 Bot de WhatsApp:
- ✅ Respuestas automáticas con GPT-4
- ✅ Memoria individual por contacto
- ✅ Personalidad de entrenador fitness
- ✅ Integración con base de datos

### 🖥️ Dashboard Web:
- ✅ Gestión de contactos
- ✅ Analytics en tiempo real
- ✅ Configuración del AI
- ✅ Historial de conversaciones

### 📱 App Móvil:
- ✅ Control remoto del bot
- ✅ Estadísticas móviles
- ✅ Gestión de entrenamientos
- ✅ Configuración en movimiento

---

## 💰 COSTOS MENSUALES ESTIMADOS

### Tier Gratuito (Para empezar):
- ✅ Supabase: Gratis (hasta 500MB)
- ✅ Render: Gratis (750h/mes, auto-sleep)
- ✅ Vercel: Gratis (100GB bandwidth)
- ⚠️ OpenAI: $5-15/mes (según uso)
- ⚠️ Twilio: Gratis en sandbox, $0.005-0.09/mensaje en producción

**Total estimado**: $5-20/mes para empezar

### Tier Pagado (Para crecimiento):
- Render Starter: $7/mes
- Supabase Pro: $25/mes
- Vercel Pro: $20/mes
- OpenAI: $15-50/mes
- Twilio: Variable según mensajes

**Total estimado**: $60-100/mes para negocio activo

---

## 🆘 TROUBLESHOOTING

### Problemas Comunes:

#### ❌ El bot no responde:
1. Verifica webhook en Twilio
2. Revisa logs en Render
3. Confirma variables de entorno

#### ❌ Frontend no carga:
1. Verifica URL del backend
2. Revisa variables en Vercel
3. Confirma build exitoso

#### ❌ App móvil sin datos:
1. Actualiza URL de API
2. Verifica conexión a internet
3. Revisa logs de Expo

#### ❌ Errores de OpenAI:
1. Verifica créditos disponibles
2. Confirma API key válida
3. Revisa límites de rate limiting

---

## 🚀 PRÓXIMOS PASOS

Una vez funcionando:

### Mejoras Técnicas:
- 🔄 Implementar autenticación
- 🔄 Agregar notificaciones push
- 🔄 Optimizar rendimiento
- 🔄 Implementar cache

### Funcionalidades de Negocio:
- 🔄 Integrar con calendario
- 🔄 Sistema de pagos
- 🔄 Recordatorios automáticos
- 🔄 Reportes avanzados

### Escalabilidad:
- 🔄 Múltiples bots
- 🔄 API para terceros
- 🔄 Integración con CRM
- 🔄 Analytics avanzado

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa las guías detalladas en `/docs/`
2. Verifica logs en cada servicio
3. Consulta documentación oficial de cada plataforma
4. Considera contratar soporte técnico especializado

¡Felicidades! 🎉 Ahora tienes un sistema completo de WhatsApp Bot funcionando. 