-- ===============================================
-- Schema para Bot de WhatsApp Rubén
-- ===============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- Tabla de contactos
-- ===============================================
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'paused')),
    ai_enabled BOOLEAN DEFAULT true,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ,
    message_count INTEGER DEFAULT 0
);

-- Índices para la tabla contacts
CREATE INDEX idx_contacts_phone_number ON contacts(phone_number);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_last_message_at ON contacts(last_message_at);

-- ===============================================
-- Tabla de mensajes
-- ===============================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'video', 'document')),
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
    twilio_message_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed BOOLEAN DEFAULT false,
    ai_response_id UUID
);

-- Índices para la tabla messages
CREATE INDEX idx_messages_contact_id ON messages(contact_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_direction ON messages(direction);
CREATE INDEX idx_messages_twilio_message_id ON messages(twilio_message_id);

-- ===============================================
-- Tabla de configuración de IA
-- ===============================================
CREATE TABLE ai_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE, -- NULL para configuración global
    response_delay_min INTEGER DEFAULT 2 CHECK (response_delay_min >= 0 AND response_delay_min <= 60),
    response_delay_max INTEGER DEFAULT 8 CHECK (response_delay_max >= 0 AND response_delay_max <= 120),
    temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0.0 AND temperature <= 2.0),
    max_tokens INTEGER DEFAULT 500 CHECK (max_tokens >= 50 AND max_tokens <= 2000),
    system_prompt TEXT,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para la tabla ai_config
CREATE INDEX idx_ai_config_contact_id ON ai_config(contact_id);
CREATE UNIQUE INDEX idx_ai_config_global ON ai_config(contact_id) WHERE contact_id IS NULL;

-- ===============================================
-- Tabla de datos de entrenamiento
-- ===============================================
CREATE TABLE training_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    tags JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    word_count INTEGER DEFAULT 0
);

-- Índices para la tabla training_data
CREATE INDEX idx_training_data_category ON training_data(category);
CREATE INDEX idx_training_data_active ON training_data(active);
CREATE INDEX idx_training_data_created_at ON training_data(created_at);

-- ===============================================
-- Tabla de resúmenes de conversaciones
-- ===============================================
CREATE TABLE conversation_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    key_topics JSONB DEFAULT '[]'::jsonb,
    sentiment VARCHAR(20) DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para la tabla conversation_summaries
CREATE INDEX idx_conversation_summaries_contact_id ON conversation_summaries(contact_id);
CREATE INDEX idx_conversation_summaries_created_at ON conversation_summaries(created_at);

-- ===============================================
-- Tabla de plantillas de respuesta
-- ===============================================
CREATE TABLE response_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    triggers JSONB DEFAULT '[]'::jsonb, -- Keywords que activan esta plantilla
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    usage_count INTEGER DEFAULT 0
);

-- Índices para la tabla response_templates
CREATE INDEX idx_response_templates_category ON response_templates(category);
CREATE INDEX idx_response_templates_active ON response_templates(active);

-- ===============================================
-- Tabla de usuarios (para autenticación del panel)
-- ===============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para la tabla users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ===============================================
-- Funciones y triggers
-- ===============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_config_updated_at BEFORE UPDATE ON ai_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_data_updated_at BEFORE UPDATE ON training_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_response_templates_updated_at BEFORE UPDATE ON response_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar contador de mensajes
CREATE OR REPLACE FUNCTION increment_message_count(contact_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE contacts 
    SET message_count = message_count + 1
    WHERE id = contact_id_param;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- Políticas de Row Level Security (RLS)
-- ===============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas para el servicio (acceso completo)
CREATE POLICY "Service role can do everything" ON contacts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON messages
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON ai_config
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON training_data
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON conversation_summaries
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON response_templates
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- ===============================================
-- Datos iniciales
-- ===============================================

-- Configuración global de IA inicial
INSERT INTO ai_config (contact_id, response_delay_min, response_delay_max, temperature, max_tokens, enabled, system_prompt)
VALUES (
    NULL, -- Configuración global
    2,    -- delay mínimo
    8,    -- delay máximo
    0.7,  -- temperature
    500,  -- max_tokens
    true, -- enabled
    'Eres Rubén, un entrenador fitness experimentado y carismático. Responde de forma natural y humana.'
);

-- Usuario administrador inicial (cambiar en producción)
-- Contraseña: admin123 (hasheada)
INSERT INTO users (email, full_name, hashed_password, is_active)
VALUES (
    'admin@rubenbot.com',
    'Administrador',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewowqIzx9VFz4N5G', -- admin123
    true
);

-- Datos de entrenamiento iniciales
INSERT INTO training_data (title, content, category, tags, word_count)
VALUES 
(
    'Saludo inicial de Rubén',
    '¡Hola! Soy Rubén, tu entrenador fitness personal 💪 Estoy aquí para ayudarte a alcanzar tus objetivos de fitness y transformar tu vida. No importa si eres principiante o avanzado, juntos vamos a crear un plan perfecto para ti. ¿En qué puedo ayudarte hoy?',
    'saludo',
    '["saludo", "presentacion", "motivacion"]'::jsonb,
    50
),
(
    'Consejos de motivación',
    'Recuerda que cada día es una nueva oportunidad para ser mejor que ayer. El progreso no siempre es lineal, habrá días difíciles, pero lo importante es la consistencia. No te compares con otros, tu única competencia eres tú mismo. ¡Vamos que tú puedes! 🔥',
    'motivacion',
    '["motivacion", "consistencia", "progreso"]'::jsonb,
    45
),
(
    'Importancia del descanso',
    'El descanso es tan importante como el entrenamiento. Tu cuerpo se recupera y se fortalece durante el sueño. Intenta dormir entre 7-8 horas diarias y no entrenes el mismo grupo muscular dos días seguidos. El descanso activo como caminar también es excelente.',
    'recuperacion',
    '["descanso", "recuperacion", "sueño"]'::jsonb,
    42
);

-- ===============================================
-- Vistas útiles para analytics
-- ===============================================

-- Vista de estadísticas de contactos
CREATE VIEW contact_stats AS
SELECT 
    status,
    COUNT(*) as count,
    AVG(message_count) as avg_messages
FROM contacts 
GROUP BY status;

-- Vista de actividad diaria
CREATE VIEW daily_activity AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as message_count,
    COUNT(DISTINCT contact_id) as active_contacts
FROM messages 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ===============================================
-- Índices adicionales para performance
-- ===============================================

-- Índice compuesto para búsquedas complejas
CREATE INDEX idx_messages_contact_direction_date ON messages(contact_id, direction, created_at);

-- Índice para búsquedas de texto en contenido de mensajes
CREATE INDEX idx_messages_content_search ON messages USING gin(to_tsvector('spanish', content));

-- Índice para búsquedas en datos de entrenamiento
CREATE INDEX idx_training_data_content_search ON training_data USING gin(to_tsvector('spanish', content));

-- ===============================================
-- Comentarios en las tablas
-- ===============================================

COMMENT ON TABLE contacts IS 'Almacena información de contactos de WhatsApp';
COMMENT ON TABLE messages IS 'Almacena todos los mensajes enviados y recibidos';
COMMENT ON TABLE ai_config IS 'Configuración de IA global y por contacto';
COMMENT ON TABLE training_data IS 'Datos para entrenar la personalidad de Rubén';
COMMENT ON TABLE conversation_summaries IS 'Resúmenes de conversaciones para memoria a largo plazo';
COMMENT ON TABLE response_templates IS 'Plantillas de respuesta predefinidas';
COMMENT ON TABLE users IS 'Usuarios del panel de administración';

-- ===============================================
-- Completado
-- ===============================================

-- Mostrar resumen de las tablas creadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'contacts', 'messages', 'ai_config', 'training_data', 
    'conversation_summaries', 'response_templates', 'users'
)
ORDER BY tablename; 