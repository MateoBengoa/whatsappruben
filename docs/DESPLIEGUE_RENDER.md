# Despliegue del Backend en Render

## 1. Preparar el Repositorio
Asegúrate de que tu código esté actualizado en GitHub:
```bash
git add .
git commit -m "Preparar para despliegue en Render"
git push origin main
```

## 2. Crear Cuenta en Render
1. Ve a [Render](https://render.com)
2. Crea una cuenta (puedes usar GitHub para facilitar)
3. Conecta tu cuenta de GitHub

## 3. Crear Web Service
1. En el dashboard de Render, haz clic en **New +**
2. Selecciona **Web Service**
3. Conecta tu repositorio de GitHub:
   - Repository: `tu-usuario/whatsappruben`
   - Branch: `main`

## 4. Configurar el Servicio
### Configuración Básica:
- **Name**: `whatsapp-bot-ruben-backend`
- **Region**: Selecciona la más cercana
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

### Comandos de Build y Start:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 5. Configurar Variables de Entorno
En la sección **Environment**, agrega estas variables:

```env
# OpenAI
OPENAI_API_KEY=sk-proj-tu-clave-aqui

# Twilio
TWILIO_ACCOUNT_SID=ACtu-account-sid-aqui
TWILIO_AUTH_TOKEN=tu-auth-token-aqui
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-service-role-key-aqui

# API Configuration
API_HOST=0.0.0.0
API_PORT=$PORT
DEBUG=False

# Security
SECRET_KEY=genera-una-clave-secreta-aqui
```

⚠️ **IMPORTANTE**: Usa las credenciales reales de los servicios que configuraste antes.

## 6. Plan de Precios
- **Free Tier**: 750 horas/mes, duerme después de 15 min de inactividad
- **Starter ($7/mes)**: Sin límite de horas, sin auto-sleep
- Recomendación: Empezar con Free para pruebas

## 7. Desplegar
1. Haz clic en **Create Web Service**
2. Render comenzará a construir y desplegar tu aplicación
3. El proceso toma 3-5 minutos

## 8. Verificar el Despliegue
Una vez desplegado:
1. Render te dará una URL: `https://whatsapp-bot-ruben-backend.onrender.com`
2. Visita `https://tu-app.onrender.com/docs` para ver la documentación de la API
3. Prueba el endpoint de salud: `https://tu-app.onrender.com/health`

## 9. Configurar el Webhook en Twilio
1. Copia la URL de tu aplicación desplegada
2. Ve a Twilio > WhatsApp Sandbox Settings
3. En "When a message comes in", pon:
   ```
   https://tu-app.onrender.com/webhook/whatsapp
   ```

## 10. Logs y Debugging
- Ve a **Logs** en tu servicio de Render para ver errores
- Los logs se actualizan en tiempo real
- Útil para debuggear problemas de conexión

## 11. Dominios Personalizados (Opcional)
Si tienes un dominio:
1. Ve a **Settings > Custom Domains**
2. Agrega tu dominio
3. Configura los registros DNS según las instrucciones

## 12. Auto-Deploy
Render automáticamente redespliegua cuando haces push a la rama principal:
```bash
git push origin main  # Esto disparará un nuevo despliegue
```

⚠️ **Troubleshooting Común**:
- Si el build falla, revisa los logs
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `requirements.txt` esté actualizado 