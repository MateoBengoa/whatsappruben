from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
from typing import Optional, Dict, Any
import asyncio
import random
from datetime import datetime

from config import settings
from database import db
from models import Contact, MessageCreate, MessageDirection, MessageType, ContactCreate, ContactStatus

class TwilioService:
    def __init__(self):
        self.client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        self.whatsapp_number = settings.twilio_whatsapp_number
    
    async def send_message(self, to_number: str, message_content: str, contact_id: str) -> bool:
        """
        Envía un mensaje de WhatsApp a través de Twilio
        """
        try:
            # Formatear el número de destino
            formatted_number = self._format_whatsapp_number(to_number)
            
            # Enviar mensaje
            message = self.client.messages.create(
                body=message_content,
                from_=self.whatsapp_number,
                to=formatted_number
            )
            
            # Guardar mensaje en la base de datos
            await self._save_outgoing_message(
                contact_id=contact_id,
                content=message_content,
                twilio_message_id=message.sid
            )
            
            print(f"Mensaje enviado exitosamente a {to_number}. SID: {message.sid}")
            return True
            
        except Exception as e:
            print(f"Error enviando mensaje a {to_number}: {e}")
            return False
    
    async def send_delayed_message(self, to_number: str, message_content: str, contact_id: str, delay_seconds: int):
        """
        Envía un mensaje con delay para simular tiempo de respuesta humano
        """
        try:
            # Esperar el delay especificado
            await asyncio.sleep(delay_seconds)
            
            # Enviar el mensaje
            success = await self.send_message(to_number, message_content, contact_id)
            
            if success:
                print(f"Mensaje diferido enviado después de {delay_seconds} segundos")
            
            return success
            
        except Exception as e:
            print(f"Error en mensaje diferido: {e}")
            return False
    
    async def process_incoming_webhook(self, webhook_data: Dict[str, Any]) -> MessagingResponse:
        """
        Procesa un webhook entrante de Twilio
        """
        try:
            # Extraer datos del webhook
            from_number = webhook_data.get('From', '').replace('whatsapp:', '')
            message_body = webhook_data.get('Body', '')
            message_sid = webhook_data.get('MessageSid', '')
            profile_name = webhook_data.get('ProfileName', '')
            
            print(f"Mensaje recibido de {from_number}: {message_body}")
            
            # Buscar o crear contacto
            contact = await self._get_or_create_contact(from_number, profile_name)
            
            # Guardar mensaje entrante
            await self._save_incoming_message(
                contact_id=contact.id,
                content=message_body,
                twilio_message_id=message_sid
            )
            
            # Verificar si la IA está habilitada para este contacto
            if contact.ai_enabled and contact.status == ContactStatus.ACTIVE:
                # Procesar respuesta de IA en background
                asyncio.create_task(self._process_ai_response(contact, message_body))
            
            # Respuesta vacía para Twilio (no automática)
            response = MessagingResponse()
            return response
            
        except Exception as e:
            print(f"Error procesando webhook: {e}")
            response = MessagingResponse()
            return response
    
    async def _get_or_create_contact(self, phone_number: str, profile_name: Optional[str] = None) -> Contact:
        """
        Busca o crea un contacto basado en el número de teléfono
        """
        # Formatear número
        formatted_number = self._format_phone_number(phone_number)
        
        # Buscar contacto existente
        contact = await db.get_contact_by_phone(formatted_number)
        
        if contact:
            # Actualizar nombre si no lo tiene y viene en el webhook
            if not contact.name and profile_name:
                from models import ContactUpdate
                await db.update_contact(contact.id, ContactUpdate(name=profile_name))
                contact.name = profile_name
            return contact
        
        # Crear nuevo contacto
        contact_data = ContactCreate(
            phone_number=formatted_number,
            name=profile_name,
            status=ContactStatus.ACTIVE,
            ai_enabled=True
        )
        
        new_contact = await db.create_contact(contact_data)
        print(f"Nuevo contacto creado: {formatted_number}")
        
        return new_contact
    
    async def _save_incoming_message(self, contact_id: str, content: str, twilio_message_id: str):
        """
        Guarda un mensaje entrante en la base de datos
        """
        message_data = MessageCreate(
            contact_id=contact_id,
            content=content,
            message_type=MessageType.TEXT,
            direction=MessageDirection.INCOMING,
            twilio_message_id=twilio_message_id
        )
        
        await db.create_message(message_data)
    
    async def _save_outgoing_message(self, contact_id: str, content: str, twilio_message_id: str):
        """
        Guarda un mensaje saliente en la base de datos
        """
        message_data = MessageCreate(
            contact_id=contact_id,
            content=content,
            message_type=MessageType.TEXT,
            direction=MessageDirection.OUTGOING,
            twilio_message_id=twilio_message_id
        )
        
        await db.create_message(message_data)
    
    async def _process_ai_response(self, contact: Contact, message_content: str):
        """
        Procesa la respuesta de IA en background
        """
        try:
            from services.openai_service import openai_service
            
            # Obtener historial de conversación
            conversation_history = await db.get_conversation_history(contact.id, limit=20)
            
            # Generar respuesta con IA
            ai_response = await openai_service.generate_response(
                contact=contact,
                message_content=message_content,
                conversation_history=conversation_history
            )
            
            # Obtener configuración de delay
            ai_config = await db.get_ai_config(contact.id)
            if not ai_config:
                ai_config = await db.get_ai_config()  # Global config
            
            # Calcular delay aleatorio
            if ai_config:
                delay_min = ai_config.response_delay_min
                delay_max = ai_config.response_delay_max
            else:
                delay_min = settings.response_delay_min
                delay_max = settings.response_delay_max
            
            delay_seconds = random.randint(delay_min, delay_max)
            
            # Enviar respuesta con delay
            await self.send_delayed_message(
                to_number=contact.phone_number,
                message_content=ai_response,
                contact_id=contact.id,
                delay_seconds=delay_seconds
            )
            
            # Generar resumen de conversación periódicamente
            if len(conversation_history) % 10 == 0:  # Cada 10 mensajes
                await self._generate_conversation_summary(contact.id, conversation_history)
            
        except Exception as e:
            print(f"Error procesando respuesta de IA para {contact.phone_number}: {e}")
    
    async def _generate_conversation_summary(self, contact_id: str, messages):
        """
        Genera y guarda un resumen de la conversación
        """
        try:
            from services.openai_service import openai_service
            from models import ConversationCreate
            
            # Generar resumen con IA
            summary_data = await openai_service.generate_conversation_summary(messages)
            
            # Guardar resumen en la base de datos
            conversation_summary = ConversationCreate(
                contact_id=contact_id,
                summary=summary_data.get('summary', ''),
                key_topics=summary_data.get('key_topics', []),
                sentiment=summary_data.get('sentiment', 'neutral')
            )
            
            await db.create_conversation_summary(conversation_summary)
            print(f"Resumen de conversación guardado para contacto {contact_id}")
            
        except Exception as e:
            print(f"Error generando resumen de conversación: {e}")
    
    def _format_whatsapp_number(self, phone_number: str) -> str:
        """
        Formatea el número para WhatsApp (añade whatsapp: prefix)
        """
        if phone_number.startswith('whatsapp:'):
            return phone_number
        
        if not phone_number.startswith('+'):
            phone_number = '+' + phone_number
        
        return f"whatsapp:{phone_number}"
    
    def _format_phone_number(self, phone_number: str) -> str:
        """
        Formatea el número de teléfono para almacenamiento
        """
        # Remover prefijo whatsapp: si existe
        if phone_number.startswith('whatsapp:'):
            phone_number = phone_number.replace('whatsapp:', '')
        
        # Asegurar que empiece con +
        if not phone_number.startswith('+'):
            phone_number = '+' + phone_number
        
        return phone_number
    
    async def send_broadcast_message(self, contact_ids: list, message_content: str) -> Dict[str, Any]:
        """
        Envía un mensaje de difusión a múltiples contactos
        """
        results = {
            'successful': 0,
            'failed': 0,
            'errors': []
        }
        
        for contact_id in contact_ids:
            try:
                contact = await db.get_contact(contact_id)
                if not contact:
                    results['failed'] += 1
                    results['errors'].append(f"Contacto {contact_id} no encontrado")
                    continue
                
                if contact.status != ContactStatus.ACTIVE:
                    results['failed'] += 1
                    results['errors'].append(f"Contacto {contact.phone_number} no está activo")
                    continue
                
                success = await self.send_message(
                    to_number=contact.phone_number,
                    message_content=message_content,
                    contact_id=contact.id
                )
                
                if success:
                    results['successful'] += 1
                else:
                    results['failed'] += 1
                    
                # Delay entre mensajes para evitar rate limiting
                await asyncio.sleep(1)
                
            except Exception as e:
                results['failed'] += 1
                results['errors'].append(f"Error enviando a {contact_id}: {str(e)}")
        
        return results
    
    async def get_message_status(self, message_sid: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene el estado de un mensaje de Twilio
        """
        try:
            message = self.client.messages(message_sid).fetch()
            return {
                'sid': message.sid,
                'status': message.status,
                'error_code': message.error_code,
                'error_message': message.error_message,
                'date_sent': message.date_sent,
                'date_updated': message.date_updated
            }
        except Exception as e:
            print(f"Error obteniendo estado del mensaje {message_sid}: {e}")
            return None

# Instancia global del servicio
twilio_service = TwilioService() 