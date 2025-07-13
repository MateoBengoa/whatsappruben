# Configuración de Supabase

## 1. Crear Proyecto
1. Ve a [Supabase](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una nueva organización o usa una existente
4. Crea un nuevo proyecto:
   - **Name**: WhatsApp Bot Ruben
   - **Database Password**: [Genera una contraseña segura]
   - **Region**: Selecciona la más cercana a ti
5. Espera a que se inicialice (2-3 minutos)

## 2. Configurar Base de Datos
1. Ve a la pestaña "SQL Editor"
2. Copia y pega el contenido del archivo `shared/supabase_schema.sql`
3. Ejecuta el script para crear todas las tablas

## 3. Obtener Credenciales
Ve a **Settings > API** y guarda:
- **Project URL**: `https://xxxxx.supabase.co`
- **API Key (anon/public)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **API Key (service_role)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ⚠️ **SECRETO**

## 4. Configurar Autenticación (Opcional)
Si quieres proteger el dashboard:
1. Ve a **Authentication > Settings**
2. Habilita "Enable email confirmations"
3. Configura proveedores de autenticación según necesites

## 5. Configurar Políticas de Seguridad (RLS)
1. Ve a **Authentication > Policies**
2. Habilita Row Level Security en todas las tablas
3. Crea políticas básicas para lectura/escritura según tus necesidades

⚠️ **IMPORTANTE**: Guarda todas estas credenciales de forma segura, las necesitarás en los siguientes pasos. 