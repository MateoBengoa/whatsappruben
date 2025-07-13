// API configuration for mobile app
const API_URL = 'http://localhost:8000' // Change this to your production API URL

// For now, we'll use mock data until the API is fully connected
export const analyticsApi = {
  getData: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      total_contacts: 42,
      active_contacts: 38,
      total_messages: 1247,
      ai_responses: 892,
      response_rate: 89.5,
      avg_response_time: 2.3,
      top_contacts: [
        { name: 'Juan Pérez', phone_number: '+34123456789', message_count: 45 },
        { name: 'María García', phone_number: '+34987654321', message_count: 32 },
        { name: 'Carlos López', phone_number: '+34555666777', message_count: 28 },
      ],
      daily_stats: {
        '2024-01-15': 45,
        '2024-01-16': 52,
        '2024-01-17': 38,
        '2024-01-18': 67,
        '2024-01-19': 43,
        '2024-01-20': 58,
        '2024-01-21': 71,
      }
    }
  }
}

export const contactsApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return [
      {
        id: '1',
        name: 'Juan Pérez',
        phone_number: '+34123456789',
        status: 'active',
        ai_enabled: true,
        message_count: 45,
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['cliente', 'premium']
      },
      {
        id: '2',
        name: 'María García',
        phone_number: '+34987654321',
        status: 'active',
        ai_enabled: true,
        message_count: 32,
        last_message_at: new Date(Date.now() - 3600000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['nuevo']
      }
    ]
  }
}

export const trainingDataApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    return [
      {
        id: '1',
        title: 'Saludo de Rubén',
        content: '¡Hola! Soy Rubén, tu entrenador fitness...',
        category: 'saludo',
        tags: ['saludo', 'presentacion'],
        active: true,
        word_count: 45,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  }
} 