<template>
    <div :class="['w-full flex flex-col flex-1 lg:flex-none lg:h-auto', isFullscreen ? 'fixed inset-0 z-50 bg-white lg:col-span-4' : 'lg:col-span-3']">
        <!-- 聊天窗口 -->
        <div class="bg-white lg:border-4 border-black lg:shadow-retro flex-1 lg:flex-none flex flex-col min-h-0">
            <!-- 桌面端标题栏 -->
            <div class="hidden lg:flex bg-black text-white px-2 py-1 text-sm font-bold mb-0 items-center justify-between">
                <span>3. CHAT WINDOW</span>
                <div class="flex items-center gap-2">
                    <span class="text-xs">{{ currentSession?.title || 'No Chat Selected' }}</span>
                    <!-- <button
                        @click="$emit('toggle-fullscreen')"
                        class="bg-white text-black px-2 py-1 text-xs font-bold hover:bg-gray-200 border border-gray-300 rounded"
                        :title="isFullscreen ? '退出全屏' : '全屏'"
                    >
                        {{ isFullscreen ? '🗗' : '🗖' }}
                    </button> -->
                </div>
            </div>

            <!-- 模型和预设信息栏 -->
            <div class="bg-retro-blue lg:border-b-2 border-black px-2 py-1 lg:px-3 lg:py-2 flex items-center justify-between text-white text-xs font-bold flex-shrink-0">
                <div class="flex items-center gap-2 lg:gap-3">
                    <span class="bg-black px-2 py-1 rounded text-xs">🤖 {{ apiConfig.model || 'No Model' }}</span>
                    <span class="bg-black px-2 py-1 rounded text-xs hidden sm:inline">{{ presetTitle }}</span>
                </div>
                <div class="text-xs opacity-75">🌡️ {{ apiConfig.temperature || 0.7 }}</div>
            </div>

            <div
                ref="messagesContainer"
                :class="['overflow-y-auto p-2 lg:p-4 bg-gray-50 custom-scrollbar pb-20 lg:pb-4', isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[calc(100vh-115px)] lg:h-96']"
                style="background-image: repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0, 0, 0, 0.03) 20px, rgba(0, 0, 0, 0.03) 21px)"
                @click="$emit('hide-toolbar')"
            >
                <!-- 欢迎消息 -->
                <div v-if="!currentSession?.messages.length" class="text-center py-8 lg:py-16">
                    <div class="text-4xl lg:text-6xl mb-4 animate-bounce-slow">🤖</div>
                    <div class="font-bold text-base lg:text-lg mb-2">WAITING FOR INPUT...</div>
                    <div class="text-xs lg:text-sm text-gray-600 px-4">Start a conversation to see the magic!</div>
                </div>

                <!-- 消息列表 -->
                <MessageItem
                    v-for="message in currentSession?.messages"
                    :key="message.id"
                    :message="message"
                    :is-loading="isLoading"
                    :show-toolbar="showToolbar === message.id"
                    @toggle-toolbar="$emit('toggle-toolbar', $event)"
                    @copy-message="$emit('copy-message', $event)"
                />
            </div>
        </div>

        <!-- InputArea 组件 -->
        <InputArea :is-loading="isLoading" @send-message="$emit('send-message', $event)" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MessageItem from './MessageItem.vue'
import InputArea from './InputArea.vue'
import type { Session, ApiConfig } from '../types/chat'

interface Props {
    currentSession: Session | null
    isLoading: boolean
    isFullscreen: boolean
    apiConfig: ApiConfig
    presetTitle: string
    showToolbar: string | null
}

defineProps<Props>()

defineEmits<{
    'toggle-fullscreen': []
    'hide-toolbar': []
    'toggle-toolbar': [messageId: string]
    'copy-message': [messageId: string, content: string]
    'send-message': [message: string]
}>()

const messagesContainer = ref<HTMLElement>()

defineExpose({
    messagesContainer
})
</script>
