export interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: number
}

export interface ChatSession {
    id: string
    title: string
    messages: Message[]
    createdAt: number
    updatedAt: number
}

export interface ApiConfig {
    apiKey: string
    baseUrl: string
    model: string
    temperature: number
}

export type SupportedModel = 'deepseek-chat' | 'deepseek-coder' | 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo'

export interface AppConfig {
    theme: 'light' | 'dark'
    language: 'zh' | 'en'
    apiConfig: ApiConfig
}
