from supabase import create_client, Client
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
from config import settings
from models import *
import uuid

class SupabaseClient:
    def __init__(self):
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_key
        )
    
    # Contacts CRUD
    async def create_contact(self, contact_data: ContactCreate) -> Contact:
        data = contact_data.dict()
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = datetime.utcnow().isoformat()
        data['tags'] = json.dumps(data['tags'])
        
        result = self.client.table('contacts').insert(data).execute()
        return Contact(**result.data[0])
    
    async def get_contact(self, contact_id: str) -> Optional[Contact]:
        result = self.client.table('contacts').select('*').eq('id', contact_id).execute()
        if result.data:
            contact_data = result.data[0]
            contact_data['tags'] = json.loads(contact_data.get('tags', '[]'))
            return Contact(**contact_data)
        return None
    
    async def get_contact_by_phone(self, phone_number: str) -> Optional[Contact]:
        result = self.client.table('contacts').select('*').eq('phone_number', phone_number).execute()
        if result.data:
            contact_data = result.data[0]
            contact_data['tags'] = json.loads(contact_data.get('tags', '[]'))
            return Contact(**contact_data)
        return None
    
    async def update_contact(self, contact_id: str, update_data: ContactUpdate) -> Optional[Contact]:
        data = {k: v for k, v in update_data.dict().items() if v is not None}
        if 'tags' in data:
            data['tags'] = json.dumps(data['tags'])
        data['updated_at'] = datetime.utcnow().isoformat()
        
        result = self.client.table('contacts').update(data).eq('id', contact_id).execute()
        if result.data:
            contact_data = result.data[0]
            contact_data['tags'] = json.loads(contact_data.get('tags', '[]'))
            return Contact(**contact_data)
        return None
    
    async def list_contacts(self, skip: int = 0, limit: int = 100, status: Optional[str] = None) -> List[Contact]:
        query = self.client.table('contacts').select('*')
        
        if status:
            query = query.eq('status', status)
        
        result = query.range(skip, skip + limit - 1).order('created_at', desc=True).execute()
        
        contacts = []
        for contact_data in result.data:
            contact_data['tags'] = json.loads(contact_data.get('tags', '[]'))
            contacts.append(Contact(**contact_data))
        
        return contacts
    
    async def delete_contact(self, contact_id: str) -> bool:
        result = self.client.table('contacts').delete().eq('id', contact_id).execute()
        return len(result.data) > 0
    
    # Messages CRUD
    async def create_message(self, message_data: MessageCreate) -> Message:
        data = message_data.dict()
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['metadata'] = json.dumps(data['metadata'])
        
        result = self.client.table('messages').insert(data).execute()
        message = result.data[0]
        message['metadata'] = json.loads(message.get('metadata', '{}'))
        
        # Update contact's last message time and count
        await self.update_contact_last_message(data['contact_id'])
        
        return Message(**message)
    
    async def get_conversation_history(self, contact_id: str, limit: int = 50) -> List[Message]:
        result = self.client.table('messages').select('*').eq('contact_id', contact_id).order('created_at', desc=True).limit(limit).execute()
        
        messages = []
        for message_data in result.data:
            message_data['metadata'] = json.loads(message_data.get('metadata', '{}'))
            messages.append(Message(**message_data))
        
        return messages[::-1]  # Return in chronological order
    
    async def update_contact_last_message(self, contact_id: str):
        # Update last_message_at and increment message_count
        self.client.table('contacts').update({
            'last_message_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', contact_id).execute()
        
        # Increment message count
        self.client.rpc('increment_message_count', {'contact_id': contact_id}).execute()
    
    # AI Configuration CRUD
    async def get_ai_config(self, contact_id: Optional[str] = None) -> Optional[AIConfig]:
        if contact_id:
            # Get contact-specific config first
            result = self.client.table('ai_config').select('*').eq('contact_id', contact_id).execute()
            if result.data:
                return AIConfig(**result.data[0])
        
        # Get global config
        result = self.client.table('ai_config').select('*').is_('contact_id', 'null').execute()
        if result.data:
            return AIConfig(**result.data[0])
        
        return None
    
    async def create_ai_config(self, config_data: AIConfigCreate) -> AIConfig:
        data = config_data.dict()
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = datetime.utcnow().isoformat()
        
        result = self.client.table('ai_config').insert(data).execute()
        return AIConfig(**result.data[0])
    
    async def update_ai_config(self, config_id: str, update_data: AIConfigUpdate) -> Optional[AIConfig]:
        data = {k: v for k, v in update_data.dict().items() if v is not None}
        data['updated_at'] = datetime.utcnow().isoformat()
        
        result = self.client.table('ai_config').update(data).eq('id', config_id).execute()
        if result.data:
            return AIConfig(**result.data[0])
        return None
    
    # Training Data CRUD
    async def create_training_data(self, training_data: TrainingDataCreate) -> TrainingData:
        data = training_data.dict()
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = datetime.utcnow().isoformat()
        data['word_count'] = len(data['content'].split())
        data['tags'] = json.dumps(data['tags'])
        
        result = self.client.table('training_data').insert(data).execute()
        training_data_result = result.data[0]
        training_data_result['tags'] = json.loads(training_data_result.get('tags', '[]'))
        return TrainingData(**training_data_result)
    
    async def list_training_data(self, skip: int = 0, limit: int = 100) -> List[TrainingData]:
        result = self.client.table('training_data').select('*').eq('active', True).range(skip, skip + limit - 1).order('created_at', desc=True).execute()
        
        training_data_list = []
        for data in result.data:
            data['tags'] = json.loads(data.get('tags', '[]'))
            training_data_list.append(TrainingData(**data))
        
        return training_data_list
    
    async def delete_training_data(self, training_id: str) -> bool:
        result = self.client.table('training_data').delete().eq('id', training_id).execute()
        return len(result.data) > 0
    
    # Conversation Summaries
    async def create_conversation_summary(self, summary_data: ConversationCreate) -> ConversationSummary:
        data = summary_data.dict()
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['key_topics'] = json.dumps(data['key_topics'])
        
        result = self.client.table('conversation_summaries').insert(data).execute()
        summary = result.data[0]
        summary['key_topics'] = json.loads(summary.get('key_topics', '[]'))
        return ConversationSummary(**summary)
    
    async def get_conversation_summaries(self, contact_id: str) -> List[ConversationSummary]:
        result = self.client.table('conversation_summaries').select('*').eq('contact_id', contact_id).order('created_at', desc=True).execute()
        
        summaries = []
        for summary_data in result.data:
            summary_data['key_topics'] = json.loads(summary_data.get('key_topics', '[]'))
            summaries.append(ConversationSummary(**summary_data))
        
        return summaries
    
    # Analytics
    async def get_analytics_data(self) -> AnalyticsData:
        # Total and active contacts
        total_contacts = self.client.table('contacts').select('id', count='exact').execute()
        active_contacts = self.client.table('contacts').select('id', count='exact').eq('status', 'active').execute()
        
        # Total messages and AI responses
        total_messages = self.client.table('messages').select('id', count='exact').execute()
        ai_responses = self.client.table('messages').select('id', count='exact').eq('direction', 'outgoing').execute()
        
        # Calculate response rate
        response_rate = (ai_responses.count / total_messages.count * 100) if total_messages.count > 0 else 0
        
        # Get top contacts by message count
        top_contacts_result = self.client.table('contacts').select('name, phone_number, message_count').order('message_count', desc=True).limit(10).execute()
        
        # Daily stats for last 7 days
        seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
        daily_messages = self.client.table('messages').select('created_at').gte('created_at', seven_days_ago).execute()
        
        daily_stats = {}
        for message in daily_messages.data:
            date = message['created_at'][:10]  # Extract date part
            daily_stats[date] = daily_stats.get(date, 0) + 1
        
        return AnalyticsData(
            total_contacts=total_contacts.count,
            active_contacts=active_contacts.count,
            total_messages=total_messages.count,
            ai_responses=ai_responses.count,
            response_rate=response_rate,
            avg_response_time=2.5,  # This would need more complex calculation
            top_contacts=top_contacts_result.data,
            daily_stats=daily_stats
        )

# Global database instance
db = SupabaseClient() 