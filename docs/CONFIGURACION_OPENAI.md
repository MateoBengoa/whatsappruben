# Configuración de OpenAI

## 1. Crear Cuenta y Obtener API Key
1. Ve a [OpenAI Platform](https://platform.openai.com)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** en el menú lateral
4. Haz clic en "Create new secret key"
5. Dale un nombre: "WhatsApp Bot Ruben"
6. Copia y guarda la clave: `sk-proj-xxxxxxxxxxxx`

⚠️ **IMPORTANTE**: Esta clave solo se muestra una vez. Guárdala de forma segura.

## 2. Configurar Billing
1. Ve a **Billing** en el menú lateral
2. Agrega un método de pago
3. Establece límites de uso (recomendado: $10-20/mes para empezar)

## 3. Verificar Acceso a GPT-4
1. Ve a **Models** 
2. Confirma que tienes acceso a `gpt-4` o `gpt-4-turbo`
3. Si no tienes acceso, puedes usar `gpt-3.5-turbo` temporalmente

## 4. Costos Estimados
- **GPT-4**: ~$0.03 por 1,000 tokens (entrada) + $0.06 por 1,000 tokens (salida)
- **GPT-3.5-Turbo**: ~$0.001 por 1,000 tokens (entrada) + $0.002 por 1,000 tokens (salida)

**Estimación mensual para un bot activo**: $5-15 USD

## 5. Monitoreo de Uso
1. Ve a **Usage** para monitorear tu consumo
2. Configura alertas de límite de gasto
3. Revisa logs de API calls si es necesario 