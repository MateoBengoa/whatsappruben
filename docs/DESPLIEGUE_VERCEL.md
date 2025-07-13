# Despliegue del Frontend Web en Vercel

## 1. Crear Cuenta en Vercel
1. Ve a [Vercel](https://vercel.com)
2. Crea una cuenta usando GitHub (recomendado)
3. Autoriza a Vercel para acceder a tus repositorios

## 2. Configurar el Proyecto
1. En el dashboard de Vercel, haz clic en **New Project**
2. Busca tu repositorio `whatsappruben`
3. Haz clic en **Import**

## 3. Configuración del Build
### Configuración Automática:
Vercel debería detectar automáticamente que es un proyecto Next.js.

### Configuración Manual (si es necesario):
- **Framework Preset**: Next.js
- **Root Directory**: `frontend-web`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install`

## 4. Variables de Entorno
En **Environment Variables**, agrega:

```env
# API Configuration  
NEXT_PUBLIC_API_URL=https://tu-backend-render.onrender.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key-aqui

# Environment
NODE_ENV=production
```

⚠️ **IMPORTANTE**: 
- Usa la URL real de tu backend en Render
- Solo variables que empiecen con `NEXT_PUBLIC_` estarán disponibles en el cliente

## 5. Desplegar
1. Haz clic en **Deploy**
2. Vercel construirá y desplegará tu aplicación
3. El proceso toma 1-3 minutos

## 6. Verificar el Despliegue
Una vez desplegado:
1. Vercel te dará una URL: `https://whatsappruben-xxx.vercel.app`
2. Visita la URL para ver tu dashboard funcionando
3. Verifica que las conexiones a la API funcionen

## 7. Configurar Dominio Personalizado (Opcional)
Si tienes un dominio:
1. Ve a **Settings > Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS:
   - **CNAME**: `www` → `cname.vercel-dns.com`
   - **A**: `@` → `76.76.19.61`

## 8. Configurar Auto-Deploy
Vercel automáticamente redespliegue en cada push:
- **Production**: Depliegues desde `main`
- **Preview**: Depliegues desde otras ramas
- **Instant Rollback**: Posibilidad de volver a versiones anteriores

## 9. Configuraciones Avanzadas

### 9.1 Configurar Variables por Entorno
```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Preview  
NEXT_PUBLIC_API_URL=https://tu-backend-render.onrender.com

# Production
NEXT_PUBLIC_API_URL=https://tu-backend-render.onrender.com
```

### 9.2 Configurar Redirects (en vercel.json)
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://tu-backend-render.onrender.com/:path*"
    }
  ]
}
```

## 10. Monitoreo y Analytics
1. Ve a **Analytics** para ver métricas de uso
2. Configura **Speed Insights** para rendimiento
3. Habilita **Web Vitals** para métricas de experiencia de usuario

## 11. Colaboración
Para agregar colaboradores:
1. Ve a **Settings > Members**
2. Invita miembros por email
3. Asigna roles (Viewer, Developer, Owner)

## 12. Build & Development Settings
### Configuraciones útiles:
- **Node.js Version**: 18.x (recomendado)
- **Package Manager**: npm
- **Install Command**: `npm ci` (para builds más rápidos)

## 13. Preview Deployments
Cada Pull Request automáticamente genera un preview:
- URL única para cada PR
- Ideal para revisar cambios antes de merge
- Comentarios automáticos en GitHub

## 14. Logs y Debugging
- Ve a **Functions** para logs de API routes
- Usa **Real-time Logs** para debugging en vivo
- Configurar Source Maps para mejor debugging

⚠️ **Troubleshooting Común**:
- Si el build falla, verifica las variables de entorno
- Problemas de CORS: Configurar headers en `next.config.js`
- 404 en rutas: Verificar configuración de routing

## 15. Performance Tips
- Habilitar **Image Optimization** de Vercel
- Usar **Edge Functions** para funcionalidad server-side
- Configurar **Caching** apropiado para assets estáticos 