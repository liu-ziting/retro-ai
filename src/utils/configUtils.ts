import type { ApiConfig } from '@/types'
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
