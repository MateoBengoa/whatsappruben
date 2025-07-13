# 🤖 Bot Rubén - Sistema Completo de WhatsApp AI

Sistema completo de bot de WhatsApp con IA para Rubén, entrenador fitness. Incluye backend, frontend web y aplicación móvil totalmente funcionales.

## 🚀 Características Principales

### Bot de WhatsApp Inteligente
- **IA GPT-4** actuando como Rubén, entrenador fitness personalizado
- **Memoria individual** para cada contacto
- **Respuestas automáticas** con delays configurables (2-8 segundos)
- **Sistema de entrenamiento** con archivos de texto personalizados

### Panel Web de Administración
- **Dashboard en tiempo real** con analytics y estadísticas
- **Gestión completa de contactos** con configuración individual de IA
- **Sistema de entrenamiento** para subir y gestionar datos de IA
- **Configuración avanzada** de parámetros de respuesta
- **Testing en vivo** de respuestas de IA
- **Sistema de difusión** masiva de mensajes

### Aplicación Móvil iOS/Android
- **Navegación nativa** con tabs
- **Dashboard móvil** con estadísticas en tiempo real
- **Gestión de contactos** optimizada para móvil
- **Configuración de IA** desde el dispositivo
- **Ready para TestFlight** y Google Play Store

## 📱 Estructura del Proyecto

```
whatsappruben/
├── backend/              # API Python/FastAPI
│   ├── main.py          # Aplicación principal
│   ├── models.py        # Modelos Pydantic
│   ├── database.py      # Cliente Supabase
│   ├── config.py        # Configuración
│   ├── services/        # Servicios (OpenAI, Twilio)
│   └── requirements.txt # Dependencias Python
├── frontend-web/        # Next.js 13+ App Router
│   ├── src/app/        # Páginas y layouts
│   ├── src/components/ # Componentes React
│   ├── src/lib/        # Utilidades y API
│   └── package.json    # Dependencias Node.js
├── frontend-mobile/     # React Native/Expo
│   ├── app/            # Expo Router
│   ├── components/     # Componentes nativos
│   ├── constants/      # Colores y constantes
│   └── package.json    # Dependencias móvil
├── shared/             # Recursos compartidos
│   └── supabase_schema.sql # Esquema de base de datos
└── docs/               # Documentación
    ├── SETUP.md        # Guía de configuración
    └── FEATURES.md     # Lista de características
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.11+** con FastAPI
- **Supabase** (PostgreSQL) como base de datos
- **OpenAI GPT-4** para respuestas inteligentes
- **Twilio** para integración WhatsApp
- **Render.com** para deployment

### Frontend Web
- **Next.js 13+** con App Router
- **React 18** con hooks y TypeScript
- **TanStack Query** para state management
- **Tailwind CSS** para estilos
- **Heroicons** para iconografía
- **Vercel** para deployment

### Aplicación Móvil
- **React Native** con Expo Router
- **TypeScript** para type safety
- **Expo** para desarrollo y build
- **React Query** para API calls
- **EAS Build** para distribución iOS/Android

### Base de Datos
- **Supabase PostgreSQL** con Row Level Security
- **Triggers automáticos** para timestamping
- **Índices optimizados** para performance
- **Funciones SQL** personalizadas

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- Python 3.11+
- Cuenta Supabase
- API Key de OpenAI
- Cuenta Twilio con WhatsApp Business

### 1. Backend (API)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Web
```bash
cd frontend-web
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu API URL

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

### 3. App Móvil
```bash
cd frontend-mobile
npm install

# Instalar Expo CLI
npm install -g @expo/cli

# Desarrollo
npx expo start

# Para iOS (requiere Mac)
npx expo run:ios

# Para Android
npx expo run:android
```

### 4. Base de Datos
```bash
# Ejecutar el schema SQL en Supabase
# Copiar contenido de shared/supabase_schema.sql
# y ejecutarlo en el SQL Editor de Supabase
```

## 📋 Configuración de Servicios Externos

### OpenAI
1. Obtener API key en https://platform.openai.com/
2. Agregar `OPENAI_API_KEY` al .env del backend

### Twilio WhatsApp
1. Crear cuenta en https://twilio.com/
2. Configurar WhatsApp Business API
3. Agregar credenciales Twilio al .env

### Supabase
1. Crear proyecto en https://supabase.com/
2. Ejecutar el schema SQL
3. Configurar RLS policies
4. Agregar URL y anon key al .env

### Deployment

#### Backend (Render.com)
- Deploy automático desde GitHub
- Configurar variables de entorno
- Usar `render.yaml` incluido

#### Frontend (Vercel)
- Deploy automático desde GitHub
- Configurar variables de entorno
- Build command: `npm run build`

#### Móvil (EAS Build)
```bash
# Configurar EAS
npx eas build:configure

# Build para iOS
npx eas build --platform ios

# Build para Android
npx eas build --platform android

# Submit a App Store
npx eas submit --platform ios
```

## 🔧 Configuración Avanzada

### Personalización de Rubén
1. Editar `backend/config.py` para cambiar la personalidad
2. Subir archivos de entrenamiento desde el panel web
3. Ajustar parámetros de temperatura y delay

### Configuración de IA por Contacto
- Habilitar/deshabilitar IA individualmente
- Configurar delays personalizados
- Establecer prompts específicos

### Analytics y Monitoreo
- Dashboard en tiempo real
- Métricas de rendimiento
- Logs de conversaciones
- Estadísticas de uso

## 📱 Características Específicas

### Panel Web
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de contactos
- ✅ Sistema de entrenamiento de IA
- ✅ Configuración avanzada de respuestas
- ✅ Testing de IA en vivo
- ✅ Sistema de difusión masiva
- ✅ Analytics detallados
- ✅ Modo oscuro/claro

### App Móvil
- ✅ Dashboard nativo optimizado
- ✅ Gestión de contactos móvil
- ✅ Configuración de IA táctil
- ✅ Navegación por tabs
- ✅ Pull-to-refresh
- ✅ Tema automático
- ✅ Ready para App Store

### Backend
- ✅ API REST completa
- ✅ Webhooks de Twilio
- ✅ Integración OpenAI GPT-4
- ✅ Sistema de memoria por contacto
- ✅ Rate limiting
- ✅ Logs estructurados
- ✅ Health checks

## 🔒 Seguridad

- **Row Level Security** en Supabase
- **API Keys** encriptadas
- **Rate limiting** en endpoints
- **Validación** de entrada con Pydantic
- **CORS** configurado correctamente
- **Environment variables** para secretos

## 📊 Monitoreo

### Métricas Incluidas
- Total de contactos activos
- Mensajes procesados
- Tasa de respuesta de IA
- Tiempo promedio de respuesta
- Uso de tokens OpenAI
- Estadísticas por día/semana/mes

### Health Checks
- `/health` - Estado general del sistema
- `/health/db` - Conexión a base de datos
- `/health/openai` - Conectividad OpenAI
- `/health/twilio` - Estado Twilio

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🚀 Guías de Instalación y Configuración

### 📖 **¡EMPEZAR AQUÍ!**

**[📋 GUÍA COMPLETA](docs/GUIA_COMPLETA.md)** - Proceso paso a paso completo 
*Tiempo estimado: 2-3 horas | Costo: $5-20/mes*

### 🗄️ Configuración de Servicios:
- [🗄️ Supabase (Base de datos)](docs/CONFIGURACION_SUPABASE.md)
- [🤖 OpenAI (GPT-4)](docs/CONFIGURACION_OPENAI.md)
- [📱 Twilio (WhatsApp)](docs/CONFIGURACION_TWILIO.md)

### 🌐 Despliegue en Producción:
- [🔧 Backend en Render](docs/DESPLIEGUE_RENDER.md)
- [⚡ Frontend Web en Vercel](docs/DESPLIEGUE_VERCEL.md)
- [📱 App Móvil con Expo](docs/CONFIGURACION_MOBILE.md)

### 🎯 Resultados Finales:
✅ Bot WhatsApp con GPT-4 funcionando  
✅ Dashboard web para gestión  
✅ App móvil para control remoto  
✅ Base de datos en la nube  
✅ Todo desplegado en producción  

---

## 🆘 Soporte

Para soporte y consultas:
- 📧 Email: ruben@fitnessbot.com
- 💬 WhatsApp: +34 XXX XXX XXX
- 🐛 Issues: GitHub Issues

## 🚀 Roadmap

### v1.1 (Próximo)
- [ ] Chat en tiempo real en web
- [ ] Notificaciones push móvil
- [ ] Plantillas de respuesta
- [ ] Análisis de sentimientos
- [ ] Integración con calendarios

### v2.0 (Futuro)
- [ ] Multi-idioma
- [ ] IA de voz
- [ ] Integración Instagram/Telegram
- [ ] Dashboard de métricas avanzado
- [ ] API pública para terceros

---

**🤖 Bot Rubén v1.0.0** - Transformando vidas a través de la tecnología y el fitness 💪 