from fastapi import FastAPI, HTTPException, Depends, Request, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from twilio.twiml.messaging_response import MessagingResponse
import uvicorn
from typing import List, Optional, Dict, Any
import asyncio
from contextlib import asynccontextmanager

from config import settings
from database import db
from models import *
from services.openai_service import openai_service
from services.twilio_service import twilio_service

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Bot de WhatsApp Rubén iniciando...")
    print("📱 Configurando conexiones...")
    yield
    # Shutdown
    print("👋 Bot de WhatsApp Rubén finalizando...")

# FastAPI app
app = FastAPI(
    title="Bot WhatsApp Rubén API",
    description="API completa para el bot de WhatsApp de Rubén, entrenador fitness",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Bot de WhatsApp Rubén funcionando correctamente",
        "version": "1.0.0"
    }

# Webhook de WhatsApp
@app.post("/webhook/whatsapp")
async def whatsapp_webhook(
    request: Request,
    AccountSid: str = Form(...),
    ApiVersion: str = Form(...),
    Body: str = Form(...),
    From: str = Form(...),
    To: str = Form(...),
    MessageSid: str = Form(...),
    NumSegments: str = Form(...),
    ProfileName: Optional[str] = Form(None),
    WaId: str = Form(...),
    SmsStatus: str = Form(...),
    NumMedia: str = Form("0")
):
    """
    Webhook para recibir mensajes de WhatsApp desde Twilio
    """
    try:
        webhook_data = {
            "AccountSid": AccountSid,
            "ApiVersion": ApiVersion,
            "Body": Body,
            "From": From,
            "To": To,
            "MessageSid": MessageSid,
            "NumSegments": NumSegments,
            "ProfileName": ProfileName,
            "WaId": WaId,
            "SmsStatus": SmsStatus,
            "NumMedia": NumMedia
        }
        
        # Procesar el mensaje
        response = await twilio_service.process_incoming_webhook(webhook_data)
        
        return JSONResponse(content={"status": "success"})
        
    except Exception as e:
        print(f"Error en webhook: {e}")
        return JSONResponse(content={"status": "error", "message": str(e)})

# Endpoints de Contactos
@app.post("/api/contacts", response_model=Contact)
async def create_contact(contact_data: ContactCreate):
    """Crear un nuevo contacto"""
    try:
        # Verificar que no exista ya
        existing = await db.get_contact_by_phone(contact_data.phone_number)
        if existing:
            raise HTTPException(status_code=400, detail="El contacto ya existe")
        
        contact = await db.create_contact(contact_data)
        return contact
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/contacts", response_model=List[Contact])
async def list_contacts(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
):
    """Listar contactos con paginación y filtros"""
    try:
        contacts = await db.list_contacts(skip=skip, limit=limit, status=status)
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/contacts/{contact_id}", response_model=Contact)
async def get_contact(contact_id: str):
    """Obtener un contacto específico"""
    contact = await db.get_contact(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")
    return contact

@app.put("/api/contacts/{contact_id}", response_model=Contact)
async def update_contact(contact_id: str, update_data: ContactUpdate):
    """Actualizar un contacto"""
    contact = await db.update_contact(contact_id, update_data)
    if not contact:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")
    return contact

@app.delete("/api/contacts/{contact_id}")
async def delete_contact(contact_id: str):
    """Eliminar un contacto"""
    success = await db.delete_contact(contact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")
    return {"message": "Contacto eliminado exitosamente"}

# Endpoints de Mensajes
@app.get("/api/contacts/{contact_id}/messages", response_model=List[Message])
async def get_conversation_history(contact_id: str, limit: int = 50):
    """Obtener historial de conversación"""
    try:
        messages = await db.get_conversation_history(contact_id, limit)
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/contacts/{contact_id}/messages")
async def send_manual_message(contact_id: str, message_data: dict):
    """Enviar mensaje manual a un contacto"""
    try:
        contact = await db.get_contact(contact_id)
        if not contact:
            raise HTTPException(status_code=404, detail="Contacto no encontrado")
        
        message_content = message_data.get("content", "")
        if not message_content:
            raise HTTPException(status_code=400, detail="Contenido del mensaje requerido")
        
        success = await twilio_service.send_message(
            to_number=contact.phone_number,
            message_content=message_content,
            contact_id=contact.id
        )
        
        if success:
            return {"message": "Mensaje enviado exitosamente"}
        else:
            raise HTTPException(status_code=500, detail="Error enviando mensaje")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de Configuración de IA
@app.get("/api/ai-config", response_model=Optional[AIConfig])
async def get_global_ai_config():
    """Obtener configuración global de IA"""
    config = await db.get_ai_config()
    return config

@app.get("/api/contacts/{contact_id}/ai-config", response_model=Optional[AIConfig])
async def get_contact_ai_config(contact_id: str):
    """Obtener configuración de IA específica del contacto"""
    config = await db.get_ai_config(contact_id)
    return config

@app.post("/api/ai-config", response_model=AIConfig)
async def create_ai_config(config_data: AIConfigCreate):
    """Crear configuración de IA"""
    try:
        config = await db.create_ai_config(config_data)
        return config
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/ai-config/{config_id}", response_model=AIConfig)
async def update_ai_config(config_id: str, update_data: AIConfigUpdate):
    """Actualizar configuración de IA"""
    config = await db.update_ai_config(config_id, update_data)
    if not config:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    return config

# Endpoints de Datos de Entrenamiento
@app.post("/api/training-data", response_model=TrainingData)
async def create_training_data(training_data: TrainingDataCreate):
    """Crear datos de entrenamiento"""
    try:
        data = await db.create_training_data(training_data)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/training-data", response_model=List[TrainingData])
async def list_training_data(skip: int = 0, limit: int = 100):
    """Listar datos de entrenamiento"""
    try:
        data = await db.list_training_data(skip=skip, limit=limit)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/training-data/{training_id}")
async def delete_training_data(training_id: str):
    """Eliminar datos de entrenamiento"""
    success = await db.delete_training_data(training_id)
    if not success:
        raise HTTPException(status_code=404, detail="Datos de entrenamiento no encontrados")
    return {"message": "Datos de entrenamiento eliminados exitosamente"}

@app.post("/api/training-data/upload")
async def upload_training_file(request: Request):
    """Subir archivo de entrenamiento (texto)"""
    try:
        # Esta funcionalidad se implementaría con file upload
        return {"message": "Funcionalidad de upload en desarrollo"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de Analytics
@app.get("/api/analytics", response_model=AnalyticsData)
async def get_analytics():
    """Obtener datos de analytics del bot"""
    try:
        analytics = await db.get_analytics_data()
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/contacts/{contact_id}/summaries")
async def get_conversation_summaries(contact_id: str):
    """Obtener resúmenes de conversación de un contacto"""
    try:
        summaries = await db.get_conversation_summaries(contact_id)
        return summaries
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de Broadcast
@app.post("/api/broadcast")
async def send_broadcast(broadcast_data: dict):
    """Enviar mensaje de difusión"""
    try:
        contact_ids = broadcast_data.get("contact_ids", [])
        message_content = broadcast_data.get("message", "")
        
        if not contact_ids or not message_content:
            raise HTTPException(
                status_code=400, 
                detail="IDs de contactos y mensaje son requeridos"
            )
        
        results = await twilio_service.send_broadcast_message(contact_ids, message_content)
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de Testing
@app.post("/api/test-ai-response")
async def test_ai_response(test_data: dict):
    """Probar respuesta de IA sin enviar mensaje"""
    try:
        contact_id = test_data.get("contact_id")
        message_content = test_data.get("message", "")
        
        if not contact_id or not message_content:
            raise HTTPException(
                status_code=400,
                detail="ID de contacto y mensaje son requeridos"
            )
        
        contact = await db.get_contact(contact_id)
        if not contact:
            raise HTTPException(status_code=404, detail="Contacto no encontrado")
        
        conversation_history = await db.get_conversation_history(contact_id, limit=20)
        
        ai_response = await openai_service.generate_response(
            contact=contact,
            message_content=message_content,
            conversation_history=conversation_history
        )
        
        return {
            "original_message": message_content,
            "ai_response": ai_response,
            "contact_name": contact.name or contact.phone_number
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para webhook de estado de mensajes
@app.post("/webhook/message-status")
async def message_status_webhook(request: Request):
    """Webhook para recibir actualizaciones de estado de mensajes"""
    try:
        # Procesar actualización de estado
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor", "status_code": 500}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    ) 