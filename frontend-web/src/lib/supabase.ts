import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          phone_number: string
          name: string | null
          email: string | null
          notes: string | null
          status: 'active' | 'blocked' | 'paused'
          ai_enabled: boolean
          tags: string[]
          created_at: string
          updated_at: string
          last_message_at: string | null
          message_count: number
        }
        Insert: {
          id?: string
          phone_number: string
          name?: string | null
          email?: string | null
          notes?: string | null
          status?: 'active' | 'blocked' | 'paused'
          ai_enabled?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
          message_count?: number
        }
        Update: {
          id?: string
          phone_number?: string
          name?: string | null
          email?: string | null
          notes?: string | null
          status?: 'active' | 'blocked' | 'paused'
          ai_enabled?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
          message_count?: number
        }
      }
      messages: {
        Row: {
          id: string
          contact_id: string
          content: string
          message_type: 'text' | 'image' | 'audio' | 'video' | 'document'
          direction: 'incoming' | 'outgoing'
          twilio_message_id: string | null
          metadata: Record<string, any>
          created_at: string
          processed: boolean
          ai_response_id: string | null
        }
        Insert: {
          id?: string
          contact_id: string
          content: string
          message_type?: 'text' | 'image' | 'audio' | 'video' | 'document'
          direction: 'incoming' | 'outgoing'
          twilio_message_id?: string | null
          metadata?: Record<string, any>
          created_at?: string
          processed?: boolean
          ai_response_id?: string | null
        }
        Update: {
          id?: string
          contact_id?: string
          content?: string
          message_type?: 'text' | 'image' | 'audio' | 'video' | 'document'
          direction?: 'incoming' | 'outgoing'
          twilio_message_id?: string | null
          metadata?: Record<string, any>
          created_at?: string
          processed?: boolean
          ai_response_id?: string | null
        }
      }
      ai_config: {
        Row: {
          id: string
          contact_id: string | null
          response_delay_min: number
          response_delay_max: number
          temperature: number
          max_tokens: number
          system_prompt: string | null
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contact_id?: string | null
          response_delay_min?: number
          response_delay_max?: number
          temperature?: number
          max_tokens?: number
          system_prompt?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string | null
          response_delay_min?: number
          response_delay_max?: number
          temperature?: number
          max_tokens?: number
          system_prompt?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      training_data: {
        Row: {
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
        Insert: {
          id?: string
          title: string
          content: string
          category?: string
          tags?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
          word_count?: number
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
          word_count?: number
        }
      }
    }
  }
} 