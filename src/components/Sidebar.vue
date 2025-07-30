<template>
    <!-- 侧边栏抽屉 (移动端) -->
    <div v-if="showSidebar && !isFullscreen" class="lg:hidden fixed inset-0 bg-black/50 z-40" @click="$emit('close-sidebar')">
        <div class="w-80 max-w-[85vw] h-full bg-retro-yellow border-r-4 border-black shadow-retro p-4 overflow-y-auto" @click.stop>
            <!-- 抽屉头部 -->
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold">菜单</h2>
                <button @click="$emit('close-sidebar')" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro">✕</button>
            </div>

            <!-- 新建对话 -->
            <button @click="handleNewSession" class="w-full bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-retro font-bold text-center text-sm">
                <div class="text-base mb-1">💬</div>
                <div>新建对话</div>
            </button>

            <!-- 会话列表 -->
            <SessionList
                :sessions="sortedSessions"
                :current-session-id="currentSessionId"
                @select-session="handleSelectSession"
                @delete-session="$emit('delete-session', $event)"
                @reset-sessions="$emit('reset-sessions')"
                is-mobile
            />
        </div>
    </div>

    <!-- 桌面端侧边栏 -->
    <div class="hidden lg:block lg:col-span-1" :class="{ 'lg:hidden': isFullscreen }">
        <!-- 新建对话 -->
        <div class="bg-retro-green border-4 border-black shadow-retro mb-4 p-2">
            <div class="bg-black text-white px-2 py-1 text-xs font-bold mb-2 inline-block">1. NEW CHAT</div>
            <button @click="$emit('create-session')" class="w-full bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-retro font-bold text-center text-sm">
                <div class="text-lg mb-1">💬</div>
                <div>START NEW CHAT</div>
            </button>
        </div>

        <!-- 会话列表 -->
        <SessionList
            :sessions="sortedSessions"
            :current-session-id="currentSessionId"
            @select-session="$emit('select-session', $event)"
            @delete-session="$emit('delete-session', $event)"
            @reset-sessions="$emit('reset-sessions')"
        />
    </div>
</template>

<script setup lang="ts">
import SessionList from './SessionList.vue'
import type { Session } from '../types/chat'

interface Props {
    showSidebar: boolean
    isFullscreen: boolean
    sortedSessions: Session[]
    currentSessionId: string | null
}

defineProps<Props>()

const emit = defineEmits<{
    'close-sidebar': []
    'create-session': []
    'select-session': [sessionId: string]
    'delete-session': [sessionId: string]
    'reset-sessions': []
}>()

const handleNewSession = () => {
    emit('create-session')
    emit('close-sidebar')
}

const handleSelectSession = (sessionId: string) => {
    emit('select-session', sessionId)
    emit('close-sidebar')
}
</script>
