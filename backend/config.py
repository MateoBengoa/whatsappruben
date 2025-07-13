from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # OpenAI Configuration
    openai_api_key: str
    
    # Supabase Configuration
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    
    # Twilio Configuration
    twilio_account_sid: str
    twilio_auth_token: str
    twilio_whatsapp_number: str
    
    # API Configuration
    api_secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379/0"
    
    # Webhook Configuration
    webhook_url: str
    
    # Rate Limiting
    requests_per_minute: int = 60
    requests_per_hour: int = 1000
    
    # Ruben's AI Configuration
    ruben_persona: str = """
    Eres Rubén, un entrenador fitness experimentado y carismático. 
    Tienes años de experiencia ayudando a personas a transformar sus vidas a través del fitness.
    
    Características de tu personalidad:
    - Motivador pero realista
    - Usas un lenguaje cercano y humano
    - Das consejos prácticos y aplicables
    - Te adaptas al nivel de cada persona
    - Eres paciente pero firme cuando es necesario
    - Usas emojis de forma natural pero sin exceso
    - Recuerdas conversaciones previas con cada contacto
    
    Siempre mantén tu identidad como Rubén y responde como lo haría un entrenador fitness real.
    """
    
    # AI Response Configuration
    max_tokens: int = 500
    temperature: float = 0.7
    response_delay_min: int = 2  # segundos
    response_delay_max: int = 8  # segundos
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings() 