export interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: number
}

export interface Session {
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
    systemPrompt: string
    systemPromptType?: 'default' | 'coding' | 'creative' | 'academic' | 'casual'
}

export interface Statistics {
    totalSessions: number
    totalMessages: number
    totalUserMessages: number
    totalAiMessages: number
    totalCharacters: number
    totalUserCharacters: number
    totalAiCharacters: number
    totalApiCalls: number
    firstUseTime: number
    lastActiveTime: number
    dailyStats: DailyStats[]
}

export interface DailyStats {
    date: string // YYYY-MM-DD
    messages: number
    characters: number
    apiCalls: number
    usageTime: number
}
