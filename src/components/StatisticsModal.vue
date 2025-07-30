<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4" @click="$emit('close')">
        <div class="bg-white border-4 border-black shadow-retro w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up" @click.stop>
            <div class="bg-retro-blue border-b-4 border-black p-4 flex-shrink-0 flex items-center justify-between">
                <h3 class="font-bold text-white text-lg">📊 STATISTICS PANEL</h3>
                <button @click="$emit('close')" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro text-black">✕</button>
            </div>

            <!-- 可滚动内容区域 -->
            <div class="flex-1 overflow-y-auto min-h-0">
                <div class="p-6">
                    <!-- 总体统计 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <!-- 对话统计 -->
                        <div class="bg-retro-yellow border-2 border-black shadow-retro p-4">
                            <div class="text-center">
                                <div class="text-2xl mb-2">💬</div>
                                <div class="font-bold text-lg">{{ formatNumber(stats.totalSessions) }}</div>
                                <div class="text-xs text-gray-700">总对话数</div>
                            </div>
                        </div>

                        <!-- 消息统计 -->
                        <div class="bg-retro-pink border-2 border-black shadow-retro p-4">
                            <div class="text-center">
                                <div class="text-2xl mb-2">📝</div>
                                <div class="font-bold text-lg text-white">{{ formatNumber(stats.totalMessages) }}</div>
                                <div class="text-xs text-white/90">总消息数</div>
                            </div>
                        </div>

                        <!-- 字符统计 -->
                        <div class="bg-retro-green border-2 border-black shadow-retro p-4">
                            <div class="text-center">
                                <div class="text-2xl mb-2">🔤</div>
                                <div class="font-bold text-lg text-white">{{ formatNumber(stats.totalCharacters) }}</div>
                                <div class="text-xs text-white/90">总字符数</div>
                            </div>
                        </div>

                        <!-- API调用统计 -->
                        <div class="bg-retro-purple border-2 border-black shadow-retro p-4">
                            <div class="text-center">
                                <div class="text-2xl mb-2">🚀</div>
                                <div class="font-bold text-lg text-white">{{ formatNumber(stats.totalApiCalls) }}</div>
                                <div class="text-xs text-white/90">API调用次数</div>
                            </div>
                        </div>
                    </div>

                    <!-- 详细统计 -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- 消息详情 -->
                        <div class="bg-gray-50 border-2 border-black shadow-retro p-4">
                            <h4 class="font-bold text-lg mb-4 text-center bg-black text-white px-2 py-1">📊 消息详情</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center p-2 bg-white border border-gray-300">
                                    <span class="font-bold text-sm">👤 用户消息:</span>
                                    <span class="text-sm">{{ formatNumber(stats.totalUserMessages) }} 条</span>
                                </div>
                                <div class="flex justify-between items-center p-2 bg-white border border-gray-300">
                                    <span class="font-bold text-sm">🤖 AI回复:</span>
                                    <span class="text-sm">{{ formatNumber(stats.totalAiMessages) }} 条</span>
                                </div>
                                <div class="flex justify-between items-center p-2 bg-white border border-gray-300">
                                    <span class="font-bold text-sm">👤 用户字符:</span>
                                    <span class="text-sm">{{ formatNumber(stats.totalUserCharacters) }} 字</span>
                                </div>
                                <div class="flex justify-between items-center p-2 bg-white border border-gray-300">
                                    <span class="font-bold text-sm">🤖 AI字符:</span>
                                    <span class="text-sm">{{ formatNumber(stats.totalAiCharacters) }} 字</span>
                                </div>
                            </div>
                        </div>

                        <!-- API调用详情 -->
                        <div class="bg-gray-50 border-2 border-black shadow-retro p-4">
                            <h4 class="font-bold text-lg mb-4 text-center bg-black text-white px-2 py-1">🚀 API详情</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center p-2 bg-white border border-gray-300">
                                    <span class="font-bold text-sm">🔄 总调用次数:</span>
                                    <span class="text-sm">{{ formatNumber(stats.totalApiCalls) }} 次</span>
                                </div>
                                <div class="flex justify-between items-center p-2 bg-white border border-gray-300">
                                    <span class="font-bold text-sm">📊 成功率:</span>
                                    <span class="text-sm"> {{ stats.totalApiCalls > 0 ? Math.round((stats.totalAiMessages / stats.totalApiCalls) * 100) : 0 }}% </span>
                                </div>
                                <div class="flex justify-between items-center p-2 bg-white border border-gray-300">
                                    <span class="font-bold text-sm">🎯 首次使用:</span>
                                    <span class="text-sm">{{ new Date(stats.firstUseTime).toLocaleDateString('zh-CN') }}</span>
                                </div>
                                <div class="flex justify-between items-center p-2 bg-white border border-gray-300">
                                    <span class="font-bold text-sm">🔄 最后活跃:</span>
                                    <span class="text-sm">{{ formatTime(stats.lastActiveTime) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatNumber } from '../utils/configUtils'
import type { Statistics } from '../types/chat'

interface Props {
    show: boolean
    stats: Statistics
}

defineProps<Props>()

defineEmits<{
    close: []
}>()

const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) return 'NOW'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}M AGO`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}H AGO`

    return new Date(timestamp)
        .toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        .toUpperCase()
}
</script>
