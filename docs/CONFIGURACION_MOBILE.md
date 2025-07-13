# Configuración de la Aplicación Móvil

## 1. Prerrequisitos
### Instalar herramientas necesarias:

#### Para Windows:
```bash
# Instalar Node.js y npm (si no lo tienes)
# Descargar desde: https://nodejs.org/

# Instalar Expo CLI globalmente
npm install -g @expo/cli

# Instalar EAS CLI (para builds)
npm install -g eas-cli
```

#### Para macOS (adicional para iOS):
```bash
# Instalar Xcode desde App Store (para iOS)
# Instalar Expo CLI
npm install -g @expo/cli eas-cli
```

## 2. Configurar el Proyecto Móvil

### 2.1 Navegar al directorio móvil:
```bash
cd frontend-mobile
```

### 2.2 Instalar dependencias:
```bash
npm install
```

### 2.3 Configurar EAS (Expo Application Services):
```bash
# Iniciar sesión en Expo
npx expo login

# Configurar EAS para el proyecto
eas build:configure
```

## 3. Configuración de API (Conectar con tu backend)

### 3.1 Editar archivo de configuración API:
En `frontend-mobile/lib/api.ts`, actualiza la URL base:

```typescript
// Cambiar esta línea:
const API_BASE_URL = 'http://localhost:8000';

// Por tu URL de Render:
const API_BASE_URL = 'https://tu-backend-render.onrender.com';
```

### 3.2 Configurar variables de entorno (opcional):
Crea `frontend-mobile/.env`:
```env
EXPO_PUBLIC_API_URL=https://tu-backend-render.onrender.com
```

## 4. Desarrollo y Pruebas

### 4.1 Iniciar servidor de desarrollo:
```bash
npx expo start
```

### 4.2 Opciones para probar:
- **📱 Expo Go App**: Instala "Expo Go" en tu teléfono y escanea el QR
- **🤖 Android Emulator**: Presiona 'a' en el terminal
- **📱 iOS Simulator**: Presiona 'i' en el terminal (solo macOS)
- **🌐 Web**: Presiona 'w' para abrir en navegador

## 5. Build para Distribución

### 5.1 Configurar app.json:
Ya está configurado, pero verifica:
```json
{
  "expo": {
    "name": "Rubén Bot Manager",
    "slug": "ruben-bot-manager",
    "bundleIdentifier": "com.ruben.botmanager",
    "package": "com.ruben.botmanager"
  }
}
```

### 5.2 Build para Android:
```bash
# Build APK para distribución interna
eas build --platform android --profile preview

# Build AAB para Google Play Store
eas build --platform android --profile production
```

### 5.3 Build para iOS (requiere macOS y cuenta de desarrollador Apple):
```bash
# Build para simulador
eas build --platform ios --profile preview

# Build para App Store
eas build --platform ios --profile production
```

## 6. Distribución

### 6.1 Distribución Interna (Testing):
```bash
# Crear link de distribución interna
eas submit --platform android --latest

# O distribuir APK directamente
# El archivo estará disponible en tu dashboard de Expo
```

### 6.2 Distribución en Stores:

#### Google Play Store:
1. Crear cuenta de desarrollador ($25 una vez)
2. Subir el AAB generado por EAS
3. Completar información de la app
4. Publicar

#### Apple App Store:
1. Cuenta de desarrollador Apple ($99/año)
2. Usar EAS Submit para subir a TestFlight
3. Completar información en App Store Connect
4. Publicar

## 7. Actualización de la App

### 7.1 Actualizaciones Over-The-Air (OTA):
```bash
# Publicar actualizaciones sin rebuild
eas update --branch production --message "Actualización de funcionalidades"
```

### 7.2 Actualizaciones de versión:
```bash
# Incrementar versión en app.json
# Luego hacer nuevo build
eas build --platform all --profile production
```

## 8. Funcionalidades de la App Móvil

### 8.1 Dashboard:
- ✅ Estadísticas en tiempo real
- ✅ Estado del bot
- ✅ Actividad reciente
- ✅ Acciones rápidas

### 8.2 Contactos:
- ✅ Lista de contactos
- ✅ Información de cada contacto
- 🔄 Gestión de contactos (próximamente)

### 8.3 Conversaciones:
- 🔄 Vista de conversaciones (en desarrollo)
- 🔄 Historial de mensajes

### 8.4 Entrenamiento:
- ✅ Gestionar datos de entrenamiento
- ✅ Agregar nuevos datos
- 🔄 Entrenar modelo (próximamente)

### 8.5 Configuración:
- ✅ Configuración del AI
- ✅ Notificaciones
- ✅ Sincronización de datos
- ✅ Información de la app

## 9. Troubleshooting

### Problemas comunes:

#### Error de conexión a API:
```bash
# Verificar que la URL del backend sea correcta
# Verificar que el backend esté ejecutándose
# Revisar logs en Expo Dev Tools
```

#### Error de build:
```bash
# Limpiar cache
npx expo install --fix

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Problemas con EAS:
```bash
# Verificar configuración
eas config

# Ver builds en progreso
eas build:list
```

## 10. Próximos Pasos
- 🔄 Implementar autenticación
- 🔄 Agregar notificaciones push
- 🔄 Implementar chat en tiempo real
- 🔄 Agregar capacidades offline
- 🔄 Implementar métricas avanzadas

⚠️ **IMPORTANTE**: La app móvil está configurada para trabajar con datos mock para desarrollo. Actualiza las URLs de API para conectar con tu backend real. 