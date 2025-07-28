import type { ApiConfig } from '@/types'
import { DEFAULT_SYSTEM_PROMPT } from '@/config/prompts'

/**
 * 获取默认API配置
 */
export function getDefaultApiConfig(): ApiConfig {
    return {
        apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-214be43c4a364f8d9922cb389c4cd55f',
        baseUrl: import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
        model: 'deepseek-chat',
        temperature: 0.7,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        systemPromptType: 'default'
    }
}

/**
 * 验证API配置是否有效
 */
export function validateApiConfig(config: Partial<ApiConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (config.apiKey && config.apiKey.trim() === '') {
        errors.push('API Key 不能为空')
    }

    if (config.baseUrl && !isValidUrl(config.baseUrl)) {
        errors.push('Base URL 格式不正确')
    }

    if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 2)) {
        errors.push('Temperature 必须在 0-2 之间')
    }

    if (config.systemPrompt && config.systemPrompt.trim() === '') {
        errors.push('系统提示词不能为空')
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

/**
 * 检查URL是否有效
 */
function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}
