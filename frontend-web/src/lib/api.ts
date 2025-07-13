import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface Contact {
  id: string
  phone_number: string
  name?: string
  email?: string
  notes?: string
  status: 'active' | 'blocked' | 'paused'
  ai_enabled: boolean
  tags: string[]
  created_at: string
  updated_at: string
  last_message_at?: string
  message_count: number
}

export interface Message {
  id: string
  contact_id: string
  content: string
  message_type: 'text' | 'image' | 'audio' | 'video' | 'document'
  direction: 'incoming' | 'outgoing'
  twilio_message_id?: string
  metadata: Record<string, any>
  created_at: string
  processed: boolean
  ai_response_id?: string
}

export interface AIConfig {
  id: string
  contact_id?: string
  response_delay_min: number
  response_delay_max: number
  temperature: number
  max_tokens: number
  system_prompt?: string
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface TrainingData {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  active: boolean
  created_at: string
  updated_at: string
  word_count: number
}

export interface AnalyticsData {
  total_contacts: number
  active_contacts: number
  total_messages: number
  ai_responses: number
  response_rate: number
  avg_response_time: number
  top_contacts: Array<{
    name?: string
    phone_number: string
    message_count: number
  }>
  daily_stats: Record<string, number>
}

// API Functions

// Contacts
export const contactsApi = {
  getAll: async (params?: { skip?: number; limit?: number; status?: string }): Promise<Contact[]> => {
    const response = await api.get('/api/contacts', { params })
    return response.data
  },

  getById: async (id: string): Promise<Contact> => {
    const response = await api.get(`/api/contacts/${id}`)
    return response.data
  },

  create: async (data: Partial<Contact>): Promise<Contact> => {
    const response = await api.post('/api/contacts', data)
    return response.data
  },

  update: async (id: string, data: Partial<Contact>): Promise<Contact> => {
    const response = await api.put(`/api/contacts/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/contacts/${id}`)
  },

  getMessages: async (id: string, limit = 50): Promise<Message[]> => {
    const response = await api.get(`/api/contacts/${id}/messages`, {
      params: { limit }
    })
    return response.data
  },

  sendMessage: async (id: string, content: string): Promise<void> => {
    await api.post(`/api/contacts/${id}/messages`, { content })
  },

  getAIConfig: async (id: string): Promise<AIConfig | null> => {
    const response = await api.get(`/api/contacts/${id}/ai-config`)
    return response.data
  },

  getSummaries: async (id: string): Promise<any[]> => {
    const response = await api.get(`/api/contacts/${id}/summaries`)
    return response.data
  }
}

// AI Configuration
export const aiConfigApi = {
  getGlobal: async (): Promise<AIConfig | null> => {
    const response = await api.get('/api/ai-config')
    return response.data
  },

  create: async (data: Partial<AIConfig>): Promise<AIConfig> => {
    const response = await api.post('/api/ai-config', data)
    return response.data
  },

  update: async (id: string, data: Partial<AIConfig>): Promise<AIConfig> => {
    const response = await api.put(`/api/ai-config/${id}`, data)
    return response.data
  }
}

// Training Data
export const trainingDataApi = {
  getAll: async (params?: { skip?: number; limit?: number }): Promise<TrainingData[]> => {
    const response = await api.get('/api/training-data', { params })
    return response.data
  },

  create: async (data: Partial<TrainingData>): Promise<TrainingData> => {
    const response = await api.post('/api/training-data', data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/training-data/${id}`)
  },

  upload: async (file: File): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)
    await api.post('/api/training-data/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// Analytics
export const analyticsApi = {
  getData: async (): Promise<AnalyticsData> => {
    const response = await api.get('/api/analytics')
    return response.data
  }
}

// Broadcast
export const broadcastApi = {
  send: async (contact_ids: string[], message: string): Promise<any> => {
    const response = await api.post('/api/broadcast', {
      contact_ids,
      message
    })
    return response.data
  }
}

// Testing
export const testingApi = {
  testAIResponse: async (contact_id: string, message: string): Promise<any> => {
    const response = await api.post('/api/test-ai-response', {
      contact_id,
      message
    })
    return response.data
  }
}

// Health check
export const healthApi = {
  check: async (): Promise<any> => {
    const response = await api.get('/health')
    return response.data
  }
} 