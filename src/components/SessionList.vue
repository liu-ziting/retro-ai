<template>
    <div class="bg-white border-2 lg:border-4 border-black shadow-retro p-3">
        <div class="bg-black text-white px-2 py-1 text-xs lg:text-sm font-bold mb-3 inline-block">
            {{ isMobile ? '对话历史' : '2. CHAT HISTORY' }}
        </div>
        <div class="space-y-2 max-h-[21.2rem] overflow-y-scroll scrollbar-hide">
            <div
                v-for="session in sessions"
                :key="session.id"
                :class="[
                    'p-2 lg:p-3 border-2 border-black cursor-pointer font-bold text-xs lg:text-sm relative group',
                    session.id === currentSessionId ? 'bg-retro-yellow shadow-retro-inset' : 'bg-gray-100 hover:bg-gray-200'
                ]"
                @click="$emit('select-session', session.id)"
            >
                <div class="truncate">{{ session.title }}</div>
                <div class="text-xs text-gray-600 mt-1">{{ formatTime(session.updatedAt) }}</div>
                <button
                    v-if="sessions.length > 1"
                    @click.stop="$emit('delete-session', session.id)"
                    :class="['absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded', isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100']"
                >
                    ×
                </button>
            </div>
        </div>

        <!-- 清空对话按钮 -->
        <div class="mt-3 pt-3 border-t-2 border-gray-200">
            <button
                @click="$emit('reset-sessions')"
                class="w-full px-2 lg:px-3 py-2 bg-retro-orange border-2 border-black font-bold text-white hover:bg-orange-400 shadow-retro text-xs lg:text-sm flex items-center justify-center gap-2"
            >
                <span>🗑️</span> Clear Conversation Log
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Session } from '../types/chat'

interface Props {
    sessions: Session[]
    currentSessionId: string | null
    isMobile?: boolean
}

defineProps<Props>()

defineEmits<{
    'select-session': [sessionId: string]
    'delete-session': [sessionId: string]
    'reset-sessions': []
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
