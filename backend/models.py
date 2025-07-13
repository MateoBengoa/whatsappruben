from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ContactStatus(str, Enum):
    ACTIVE = "active"
    BLOCKED = "blocked"
    PAUSED = "paused"

class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    AUDIO = "audio"
    VIDEO = "video"
    DOCUMENT = "document"

class MessageDirection(str, Enum):
    INCOMING = "incoming"
    OUTGOING = "outgoing"

class AIStatus(str, Enum):
    ENABLED = "enabled"
    DISABLED = "disabled"
    TRAINING = "training"

# Contact Models
class ContactBase(BaseModel):
    phone_number: str = Field(..., regex=r'^\+[1-9]\d{1,14}$')
    name: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    status: ContactStatus = ContactStatus.ACTIVE
    ai_enabled: bool = True
    tags: List[str] = []

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[ContactStatus] = None
    ai_enabled: Optional[bool] = None
    tags: Optional[List[str]] = None

class Contact(ContactBase):
    id: str
    created_at: datetime
    updated_at: datetime
    last_message_at: Optional[datetime] = None
    message_count: int = 0
    
    class Config:
        from_attributes = True

# Message Models
class MessageBase(BaseModel):
    contact_id: str
    content: str
    message_type: MessageType = MessageType.TEXT
    direction: MessageDirection
    twilio_message_id: Optional[str] = None
    metadata: Dict[str, Any] = {}

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: str
    created_at: datetime
    processed: bool = False
    ai_response_id: Optional[str] = None
    
    class Config:
        from_attributes = True

# AI Configuration Models
class AIConfigBase(BaseModel):
    contact_id: Optional[str] = None  # None = global config
    response_delay_min: int = Field(default=2, ge=0, le=60)
    response_delay_max: int = Field(default=8, ge=0, le=120)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=500, ge=50, le=2000)
    system_prompt: Optional[str] = None
    enabled: bool = True

class AIConfigCreate(AIConfigBase):
    pass

class AIConfigUpdate(BaseModel):
    response_delay_min: Optional[int] = Field(None, ge=0, le=60)
    response_delay_max: Optional[int] = Field(None, ge=0, le=120)
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(None, ge=50, le=2000)
    system_prompt: Optional[str] = None
    enabled: Optional[bool] = None

class AIConfig(AIConfigBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Training Data Models
class TrainingDataBase(BaseModel):
    title: str
    content: str
    category: str = "general"
    tags: List[str] = []
    active: bool = True

class TrainingDataCreate(TrainingDataBase):
    pass

class TrainingDataUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    active: Optional[bool] = None

class TrainingData(TrainingDataBase):
    id: str
    created_at: datetime
    updated_at: datetime
    word_count: int = 0
    
    class Config:
        from_attributes = True

# Conversation Models
class ConversationSummary(BaseModel):
    contact_id: str
    summary: str
    key_topics: List[str] = []
    sentiment: Optional[str] = None
    created_at: datetime

class ConversationCreate(BaseModel):
    contact_id: str
    summary: str
    key_topics: List[str] = []
    sentiment: Optional[str] = None

# Response Templates Models
class ResponseTemplateBase(BaseModel):
    title: str
    content: str
    category: str = "general"
    triggers: List[str] = []  # Keywords that trigger this template
    active: bool = True

class ResponseTemplateCreate(ResponseTemplateBase):
    pass

class ResponseTemplate(ResponseTemplateBase):
    id: str
    created_at: datetime
    updated_at: datetime
    usage_count: int = 0
    
    class Config:
        from_attributes = True

# Analytics Models
class AnalyticsData(BaseModel):
    total_contacts: int
    active_contacts: int
    total_messages: int
    ai_responses: int
    response_rate: float
    avg_response_time: float
    top_contacts: List[Dict[str, Any]]
    daily_stats: Dict[str, int]

# Webhook Models
class WhatsAppWebhook(BaseModel):
    AccountSid: str
    ApiVersion: str
    Body: str
    From: str
    To: str
    MessageSid: str
    NumSegments: str
    ProfileName: Optional[str] = None
    WaId: str
    SmsStatus: str
    NumMedia: str = "0"

# API Response Models
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    error: Optional[str] = None

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int

# Authentication Models
class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool = True
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# File Upload Models
class FileUpload(BaseModel):
    filename: str
    content_type: str
    size: int
    
class TrainingFileUpload(BaseModel):
    file: FileUpload
    category: str = "general"
    tags: List[str] = [] 