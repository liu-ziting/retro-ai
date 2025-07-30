import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import OpenAI from 'openai'
import type { ChatSession, Message, ApiConfig, Statistics, DailyStats } from '@/types'
import { DEFAULT_SYSTEM_PROMPT, SYSTEM_PROMPTS, type SystemPromptType } from '@/config/prompts'
import { getDefaultApiConfig, validateApiConfig, getDefaultStatistics } from '@/utils/configUtils'

export const useChatStore = defineStore('chat', () => {
    // 状态
    const sessions = ref<ChatSession[]>([])
    const currentSessionId = ref<string | null>(null)
    const isLoading = ref(false)
    const apiConfig = ref<ApiConfig>(getDefaultApiConfig())
    const statistics = ref<Statistics>(getDefaultStatistics())

    // 计算属性
    const currentSession = computed(() => sessions.value.find(s => s.id === currentSessionId.value))

    const sortedSessions = computed(() => [...sessions.value].sort((a, b) => b.updatedAt - a.updatedAt))

    // 实时统计计算
    const realTimeStats = computed(() => {
        const stats = {
            totalSessions: sessions.value.length,
            totalMessages: 0,
            totalUserMessages: 0,
            totalAiMessages: 0,
            totalCharacters: 0,
            totalUserCharacters: 0,
            totalAiCharacters: 0
        }

        sessions.value.forEach(session => {
            session.messages.forEach(message => {
                stats.totalMessages++
                stats.totalCharacters += message.content.length

                if (message.role === 'user') {
                    stats.totalUserMessages++
                    stats.totalUserCharacters += message.content.length
                } else {
                    stats.totalAiMessages++
                    stats.totalAiCharacters += message.content.length
                }
            })
        })

        return {
            ...statistics.value,
            ...stats
        }
    })

    // 方法
    const createSession = (title = '新对话') => {
        const session: ChatSession = {
            id: Date.now().toString(),
            title,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        sessions.value.push(session)
        currentSessionId.value = session.id
        saveToStorage()
        return session
    }

    const deleteSession = (sessionId: string) => {
        const index = sessions.value.findIndex(s => s.id === sessionId)
        if (index > -1) {
            sessions.value.splice(index, 1)
            if (currentSessionId.value === sessionId) {
                currentSessionId.value = sessions.value[0]?.id || null
            }
            saveToStorage()
        }
    }

    const selectSession = (sessionId: string) => {
        currentSessionId.value = sessionId
    }

    const addMessage = (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
        const session = sessions.value.find(s => s.id === sessionId)
        if (session) {
            const newMessage: Message = {
                ...message,
                id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
                timestamp: Date.now()
            }
            session.messages.push(newMessage)
            session.updatedAt = Date.now()

            // 更新统计信息
            updateDailyStats('message', message.content.length)
            statistics.value.lastActiveTime = Date.now()

            // 自动生成标题
            if (session.messages.filter(m => m.role === 'user' && m.content.trim()).length === 1 && message.role === 'user') {
                session.title = message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '')
            }

            saveToStorage()
            return newMessage
        }
    }

    const updateApiConfig = (config: Partial<ApiConfig>) => {
        const validation = validateApiConfig(config)
        if (!validation.valid) {
            console.error('配置验证失败:', validation.errors)
            throw new Error(validation.errors.join(', '))
        }
        apiConfig.value = { ...apiConfig.value, ...config }
        saveToStorage()
    }

    // 切换系统提示词类型
    const updateSystemPromptType = (type: SystemPromptType) => {
        apiConfig.value.systemPromptType = type
        apiConfig.value.systemPrompt = SYSTEM_PROMPTS[type]
        saveToStorage()
    }

    // 重置API配置到默认值
    const resetApiConfig = () => {
        apiConfig.value = getDefaultApiConfig()
        saveToStorage()
    }

    // 统计相关方法
    const updateDailyStats = (type: 'message' | 'apiCall', characters = 0) => {
        const today = new Date().toISOString().split('T')[0]
        let todayStats = statistics.value.dailyStats.find(s => s.date === today)

        if (!todayStats) {
            todayStats = {
                date: today,
                messages: 0,
                characters: 0,
                apiCalls: 0,
                usageTime: 0
            } as DailyStats
            statistics.value.dailyStats.push(todayStats)
        }

        if (type === 'message') {
            todayStats.messages++
            todayStats.characters += characters
        } else if (type === 'apiCall') {
            todayStats.apiCalls++
        }

        // 只保留最近30天的数据
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        statistics.value.dailyStats = statistics.value.dailyStats.filter(s => new Date(s.date) >= thirtyDaysAgo)
    }

    const resetStatistics = () => {
        statistics.value = getDefaultStatistics()
        localStorage.removeItem('chat-statistics')
    }

    // 重置所有配置（包括会话数据）
    const resetAllConfig = () => {
        // 重置API配置
        apiConfig.value = getDefaultApiConfig()

        // 清空所有会话
        sessions.value = []
        currentSessionId.value = null

        // 重置统计数据
        statistics.value = getDefaultStatistics()

        // 清除本地存储
        localStorage.removeItem('chat-sessions')
        localStorage.removeItem('current-session-id')
        localStorage.removeItem('api-config')
        localStorage.removeItem('chat-statistics')

        // 创建一个新的默认会话
        createSession()
    }

    // 仅重置会话数据，保留API配置
    const resetSessions = () => {
        sessions.value = []
        currentSessionId.value = null

        localStorage.removeItem('chat-sessions')
        localStorage.removeItem('current-session-id')

        // 创建一个新的默认会话
        createSession()
    }

    // 创建OpenAI客户端实例
    const createOpenAIClient = () => {
        return new OpenAI({
            baseURL: apiConfig.value.baseUrl,
            apiKey: apiConfig.value.apiKey,
            dangerouslyAllowBrowser: true // 允许在浏览器中使用
        })
    }

    // 真实的AI回复 - 支持流式响应
    const sendMessage = async (content: string) => {
        if (!currentSession.value) return
        if (!apiConfig.value.apiKey) {
            console.error('API Key is required')
            return
        }

        isLoading.value = true

        // 添加用户消息
        const userMessage = addMessage(currentSession.value.id, {
            content,
            role: 'user'
        })
        console.log('Added user message:', userMessage)

        // 创建AI消息占位符
        const aiMessage = addMessage(currentSession.value.id, {
            content: '',
            role: 'assistant'
        })
        console.log('Added AI message placeholder:', aiMessage)

        try {
            const openai = createOpenAIClient()

            // 构建消息历史 - 只包含有内容的消息，排除当前正在生成的空消息
            const messages = currentSession.value.messages
                .filter(msg => msg.content.trim() !== '' && msg.id !== aiMessage?.id)
                .map(msg => ({
                    role: msg.role as 'user' | 'assistant' | 'system',
                    content: msg.content
                }))

            // 构建最终消息列表 - 严格按照用户配置
            const finalMessages = []

            // 只有当系统提示词不为空时才添加系统消息
            if (apiConfig.value.systemPrompt && apiConfig.value.systemPrompt.trim() !== '') {
                finalMessages.push({
                    role: 'system' as const,
                    content: apiConfig.value.systemPrompt
                })
            }

            // 添加对话历史
            finalMessages.push(...messages)

            // 发起流式请求
            const stream = await openai.chat.completions.create({
                model: apiConfig.value.model,
                messages: finalMessages,
                stream: true,
                temperature: apiConfig.value.temperature
            })

            let fullResponse = ''

            // 处理流式响应
            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta
                if (delta?.content) {
                    fullResponse += delta.content

                    // 实时更新AI消息内容
                    if (aiMessage && currentSession.value) {
                        const session = sessions.value.find(s => s.id === currentSession.value!.id)
                        if (session) {
                            const messageIndex = session.messages.findIndex(m => m.id === aiMessage.id && m.role === 'assistant')
                            if (messageIndex !== -1) {
                                // 直接修改消息内容，触发Vue响应式更新
                                session.messages[messageIndex].content = fullResponse
                                session.updatedAt = Date.now()
                                console.log('Updated AI message content:', fullResponse.slice(0, 50) + '...')
                            }
                        }
                    }
                }
            }

            // 更新API调用统计
            updateDailyStats('apiCall', 0)
            statistics.value.totalApiCalls++

            // 保存到本地存储
            saveToStorage()
        } catch (error) {
            console.error('API调用失败:', error)

            // 错误处理 - 显示错误消息
            if (aiMessage && currentSession.value) {
                const session = sessions.value.find(s => s.id === currentSession.value!.id)
                if (session) {
                    const messageIndex = session.messages.findIndex(m => m.id === aiMessage.id && m.role === 'assistant')
                    if (messageIndex !== -1) {
                        session.messages[messageIndex].content = '抱歉，请求失败了。请检查网络连接和API配置。'
                    }
                }
            }
        } finally {
            isLoading.value = false
        }
    }

    // 本地存储
    const saveToStorage = () => {
        localStorage.setItem('chat-sessions', JSON.stringify(sessions.value))
        localStorage.setItem('current-session-id', currentSessionId.value || '')
        localStorage.setItem('api-config', JSON.stringify(apiConfig.value))
        localStorage.setItem('chat-statistics', JSON.stringify(statistics.value))
    }

    const loadFromStorage = () => {
        const savedSessions = localStorage.getItem('chat-sessions')
        const savedCurrentId = localStorage.getItem('current-session-id')
        const savedApiConfig = localStorage.getItem('api-config')
        const savedStatistics = localStorage.getItem('chat-statistics')

        if (savedSessions) {
            sessions.value = JSON.parse(savedSessions)
        }
        if (savedCurrentId) {
            currentSessionId.value = savedCurrentId
        }
        if (savedApiConfig) {
            apiConfig.value = JSON.parse(savedApiConfig)
        }
        if (savedStatistics) {
            statistics.value = JSON.parse(savedStatistics)
        }

        // 如果没有会话，创建一个默认会话
        if (sessions.value.length === 0) {
            createSession()
        }
    }

    return {
        sessions,
        currentSessionId,
        currentSession,
        sortedSessions,
        isLoading,
        apiConfig,
        statistics,
        realTimeStats,
        createSession,
        deleteSession,
        selectSession,
        addMessage,
        sendMessage,
        updateApiConfig,
        updateSystemPromptType,
        resetApiConfig,
        resetAllConfig,
        resetSessions,

        resetStatistics,
        loadFromStorage
    }
})
