import type { ApiConfig, Statistics } from '@/types'
import { DEFAULT_SYSTEM_PROMPT } from '@/config/prompts'

/**
 * 获取默认API配置
 */
export function getDefaultApiConfig(): ApiConfig {
    return {
        apiKey: 'a835b9f6866d48ec956d341418df8a50.NuhlKYn58EkCb5iP',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
        model: 'glm-4-flash-250414',
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

    // 允许系统提示词为空，用户可以选择不使用系统提示词

    return {
        valid: errors.length === 0,
        errors
    }
}

/**
 * 获取默认统计数据
 */
export function getDefaultStatistics(): Statistics {
    const now = Date.now()
    return {
        totalSessions: 0,
        totalMessages: 0,
        totalUserMessages: 0,
        totalAiMessages: 0,
        totalCharacters: 0,
        totalUserCharacters: 0,
        totalAiCharacters: 0,
        totalApiCalls: 0,
        firstUseTime: now,
        lastActiveTime: now,
        dailyStats: []
    }
}

/**
 * 格式化数字（添加千分位分隔符）
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('zh-CN')
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
