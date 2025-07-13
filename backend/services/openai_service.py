from openai import OpenAI
from typing import List, Dict, Any, Optional
import asyncio
import random
from datetime import datetime
import json

from config import settings
from database import db
from models import Contact, Message, AIConfig, TrainingData

class OpenAIService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        
    async def generate_response(
        self, 
        contact: Contact, 
        message_content: str, 
        conversation_history: List[Message]
    ) -> str:
        """
        Genera una respuesta personalizada como Rubén usando OpenAI
        """
        try:
            # Obtener configuración de IA específica del contacto o global
            ai_config = await db.get_ai_config(contact.id)
            if not ai_config:
                ai_config = await db.get_ai_config()  # Global config
            
            # Construir el contexto del sistema
            system_prompt = await self._build_system_prompt(contact, ai_config)
            
            # Construir el historial de conversación
            conversation_context = await self._build_conversation_context(conversation_history)
            
            # Obtener datos de entrenamiento relevantes
            training_context = await self._get_training_context(message_content)
            
            # Crear el prompt completo
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "system", "content": f"Contexto de entrenamiento: {training_context}"},
                {"role": "system", "content": f"Historial de conversación con {contact.name or contact.phone_number}: {conversation_context}"},
                {"role": "user", "content": message_content}
            ]
            
            # Configurar parámetros de la IA
            max_tokens = ai_config.max_tokens if ai_config else settings.max_tokens
            temperature = ai_config.temperature if ai_config else settings.temperature
            
            # Generar respuesta
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                presence_penalty=0.6,
                frequency_penalty=0.3
            )
            
            generated_response = response.choices[0].message.content.strip()
            
            # Post-procesar la respuesta
            final_response = await self._post_process_response(generated_response, contact)
            
            return final_response
            
        except Exception as e:
            print(f"Error generando respuesta OpenAI: {e}")
            # Respuesta de fallback
            return await self._get_fallback_response(contact)
    
    async def _build_system_prompt(self, contact: Contact, ai_config: Optional[AIConfig]) -> str:
        """
        Construye el prompt del sistema personalizado para Rubén
        """
        base_prompt = settings.ruben_persona
        
        # Añadir información específica del contacto
        contact_info = f"""
        Información del contacto actual:
        - Nombre: {contact.name or 'No especificado'}
        - Teléfono: {contact.phone_number}
        - Notas: {contact.notes or 'Sin notas adicionales'}
        - Tags: {', '.join(contact.tags) if contact.tags else 'Sin tags'}
        - Estado: {contact.status}
        """
        
        # Añadir prompt personalizado si existe
        custom_prompt = ""
        if ai_config and ai_config.system_prompt:
            custom_prompt = f"\n\nInstrucciones adicionales específicas: {ai_config.system_prompt}"
        
        # Añadir instrucciones de memoria
        memory_instructions = """
        
        IMPORTANTE - MEMORIA Y PERSONALIZACIÓN:
        - Recuerda siempre las conversaciones previas con este contacto
        - Adapta tu tono y consejos según el nivel de experiencia que hayas observado
        - Si es la primera vez que hablas con esta persona, preséntate como Rubén
        - Mantén continuidad en los planes y objetivos que hayas discutido antes
        - Si no recuerdas algo específico, pregunta de manera natural
        
        ESTILO DE COMUNICACIÓN:
        - Responde de forma concisa pero útil (máximo 2-3 párrafos)
        - Usa emojis relevantes al fitness (💪, 🏋️, 🔥, etc.) pero con moderación
        - Haz preguntas específicas para entender mejor sus objetivos
        - Da consejos prácticos y aplicables inmediatamente
        - Motiva pero sin ser exagerado o falso
        """
        
        return base_prompt + contact_info + custom_prompt + memory_instructions
    
    async def _build_conversation_context(self, conversation_history: List[Message]) -> str:
        """
        Construye el contexto de la conversación para mantener memoria
        """
        if not conversation_history:
            return "Esta es la primera conversación con este contacto."
        
        # Tomar los últimos 10 mensajes para contexto
        recent_messages = conversation_history[-10:]
        
        context_parts = []
        for message in recent_messages:
            direction = "Usuario" if message.direction == "incoming" else "Rubén"
            timestamp = message.created_at.strftime("%Y-%m-%d %H:%M")
            context_parts.append(f"[{timestamp}] {direction}: {message.content}")
        
        return "\n".join(context_parts)
    
    async def _get_training_context(self, message_content: str) -> str:
        """
        Obtiene contexto relevante de los datos de entrenamiento
        """
        try:
            # Obtener datos de entrenamiento activos
            training_data = await db.list_training_data(limit=50)
            
            if not training_data:
                return "No hay datos de entrenamiento específicos disponibles."
            
            # Buscar datos relevantes basados en palabras clave
            relevant_content = []
            message_words = message_content.lower().split()
            
            for data in training_data:
                content_words = data.content.lower().split()
                # Calcular relevancia simple
                relevance_score = len(set(message_words) & set(content_words))
                
                if relevance_score > 0:
                    relevant_content.append((data, relevance_score))
            
            # Ordenar por relevancia y tomar los más relevantes
            relevant_content.sort(key=lambda x: x[1], reverse=True)
            top_relevant = relevant_content[:3]
            
            if top_relevant:
                context_parts = []
                for data, score in top_relevant:
                    context_parts.append(f"Referencia de entrenamiento: {data.content[:200]}...")
                return "\n".join(context_parts)
            
            return "Contexto general de entrenamiento disponible."
            
        except Exception as e:
            print(f"Error obteniendo contexto de entrenamiento: {e}")
            return "Datos de entrenamiento no disponibles temporalmente."
    
    async def _post_process_response(self, response: str, contact: Contact) -> str:
        """
        Post-procesa la respuesta para asegurar consistencia
        """
        # Asegurar que la respuesta no sea demasiado larga
        if len(response) > 1000:
            response = response[:950] + "..."
        
        # Añadir el nombre del contacto si es apropiado
        if contact.name and not contact.name.lower() in response.lower():
            # Ocasionalmente usar el nombre del contacto
            if random.random() < 0.3:
                response = response.replace("!", f" {contact.name}!")
        
        return response
    
    async def _get_fallback_response(self, contact: Contact) -> str:
        """
        Respuesta de emergencia cuando falla la IA
        """
        fallback_responses = [
            f"¡Hola! Soy Rubén, tu entrenador fitness 💪 Disculpa, tuve un pequeño problema técnico. ¿Podrías repetir tu pregunta?",
            f"¡Hey! Rubén aquí 🏋️ Parece que hubo una falla temporal en mi sistema. ¿En qué puedo ayudarte con tu entrenamiento?",
            f"¡Hola! Soy Rubén 🔥 Tuve un momentito de desconexión, pero ya estoy aquí. ¿Qué necesitas saber sobre fitness?"
        ]
        
        return random.choice(fallback_responses)
    
    async def generate_conversation_summary(self, messages: List[Message]) -> Dict[str, Any]:
        """
        Genera un resumen de la conversación para memoria a largo plazo
        """
        try:
            if not messages:
                return {"summary": "", "key_topics": [], "sentiment": "neutral"}
            
            # Construir el texto de la conversación
            conversation_text = ""
            for message in messages:
                direction = "Usuario" if message.direction == "incoming" else "Rubén"
                conversation_text += f"{direction}: {message.content}\n"
            
            summary_prompt = f"""
            Analiza esta conversación entre Rubén (entrenador fitness) y un usuario.
            Genera un resumen conciso y extrae los temas clave.
            
            Conversación:
            {conversation_text}
            
            Responde en formato JSON con:
            - summary: resumen breve de la conversación
            - key_topics: lista de temas principales discutidos
            - sentiment: sentimiento general (positive/neutral/negative)
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": summary_prompt}],
                max_tokens=300,
                temperature=0.3
            )
            
            result_text = response.choices[0].message.content.strip()
            
            try:
                return json.loads(result_text)
            except json.JSONDecodeError:
                # Fallback si no es JSON válido
                return {
                    "summary": result_text,
                    "key_topics": ["fitness", "entrenamiento"],
                    "sentiment": "neutral"
                }
                
        except Exception as e:
            print(f"Error generando resumen: {e}")
            return {
                "summary": "Error generando resumen de conversación",
                "key_topics": [],
                "sentiment": "neutral"
            }
    
    async def analyze_training_data(self, content: str) -> Dict[str, Any]:
        """
        Analiza datos de entrenamiento para extraer información útil
        """
        try:
            analysis_prompt = f"""
            Analiza este texto de entrenamiento para un bot de fitness llamado Rubén.
            Extrae la información más importante sobre el estilo de comunicación y conocimiento.
            
            Texto:
            {content}
            
            Responde en formato JSON con:
            - style_notes: notas sobre el estilo de comunicación
            - key_knowledge: conocimientos clave extraídos
            - personality_traits: rasgos de personalidad observados
            - useful_phrases: frases útiles que Rubén podría usar
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": analysis_prompt}],
                max_tokens=400,
                temperature=0.3
            )
            
            result_text = response.choices[0].message.content.strip()
            
            try:
                return json.loads(result_text)
            except json.JSONDecodeError:
                return {
                    "style_notes": "Análisis de estilo no disponible",
                    "key_knowledge": [],
                    "personality_traits": [],
                    "useful_phrases": []
                }
                
        except Exception as e:
            print(f"Error analizando datos de entrenamiento: {e}")
            return {}

# Instancia global del servicio
openai_service = OpenAIService() 