# Configuración de Twilio WhatsApp

## 1. Crear Cuenta en Twilio
1. Ve a [Twilio](https://www.twilio.com)
2. Crea una cuenta gratuita
3. Verifica tu número de teléfono
4. Completa el proceso de verificación

## 2. Configurar WhatsApp Sandbox (Para Desarrollo)
1. En el Dashboard de Twilio, ve a **Messaging > Try it out > Send a WhatsApp message**
2. Sigue las instrucciones para unirte al sandbox:
   - Envía un mensaje específico al número de Twilio
   - Ejemplo: Envía "join <código>" a +14155238886
3. Una vez conectado, podrás enviar y recibir mensajes de prueba

## 3. Obtener Credenciales
Ve a **Account > Account Info** y guarda:
- **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxx`
- **Auth Token**: `xxxxxxxxxxxxxxxxxxxxxxxx` ⚠️ **SECRETO**

## 4. Configurar WhatsApp Número de Sandbox
- **Número de Sandbox**: `whatsapp:+14155238886` (para desarrollo)
- **Tu número verificado**: El que registraste en el sandbox

## 5. Configurar Webhook (Después del despliegue)
1. Ve a **Messaging > Settings > WhatsApp sandbox settings**
2. En **When a message comes in**, pon tu URL del webhook:
   ```
   https://tu-app-render.onrender.com/webhook/whatsapp
   ```
3. Método HTTP: **POST**

## 6. Para Producción (WhatsApp Business API)
⚠️ **Para uso real necesitarás aprobar tu aplicación:**

1. Ve a **Messaging > WhatsApp > Senders**
2. Solicita acceso a WhatsApp Business API
3. Proporciona información de tu negocio
4. Espera aprobación (puede tomar días/semanas)
5. Configura plantillas de mensajes aprobadas

## 7. Límites y Costos
### Sandbox (Gratis):
- Solo números verificados manualmente
- Límite de mensajes por día
- Solo para desarrollo/pruebas

### Producción:
- $0.005 - $0.09 por mensaje (según país)
- Sin límites de números
- Plantillas de mensajes requeridas

## 8. Números de Prueba para Sandbox
Agrega estos números para pruebas:
- Tu número personal
- Números de colaboradores/clientes de prueba

⚠️ **IMPORTANTE**: En el sandbox, solo los números verificados manualmente pueden recibir mensajes. 