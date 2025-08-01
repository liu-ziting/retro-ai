<template>
    <div class="mb-3 lg:mb-4 animate-slide-up">
        <div :class="['flex gap-2 lg:gap-3', message.role === 'user' ? 'justify-end' : 'justify-start']">
            <!-- AI Avatar -->
            <div v-if="message.role === 'assistant'" class="flex-shrink-0">
                <div class="w-6 h-6 lg:w-8 lg:h-8 bg-retro-blue border-2 border-black flex items-center justify-center text-white font-bold text-xs lg:text-sm">🤖</div>
            </div>

            <!-- Message bubble container -->
            <div :class="['max-w-[85%] lg:max-w-[70%] relative', message.role === 'user' ? 'text-right' : 'text-left']">
                <!-- Message bubble -->
                <div
                    :class="[
                        'p-2 lg:p-3 border-2 border-black font-bold text-xs lg:text-sm cursor-pointer',
                        message.role === 'user' ? 'bg-retro-pink text-white shadow-retro' : 'bg-white shadow-retro'
                    ]"
                    @click.stop="toggleToolbar"
                >
                    <!-- Message content or loading animation -->
                    <div v-if="message.content && message.content.trim()" class="whitespace-pre-wrap">
                        {{ message.content }}
                    </div>
                    <div v-else-if="message.role === 'assistant' && (!message.content || message.content.trim() === '') && isLoading" class="flex items-center gap-1">
                        <div class="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-black rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-black rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>

                    <!-- Timestamp -->
                    <div
                        v-if="message.content && message.content.trim()"
                        :class="['text-xs mt-2 opacity-75', message.role === 'user' ? 'text-right text-white' : 'text-left text-gray-600']"
                    >
                        {{ formatTime(message.timestamp) }}
                    </div>
                </div>

                <!-- Toolbar -->
                <div
                    v-if="showToolbar && message.content && message.content.trim()"
                    :class="['mt-1 flex gap-1 animate-slide-up', message.role === 'user' ? 'justify-end' : 'justify-start']"
                >
                    <button
                        @click.stop="copyMessage"
                        :class="[
                            'px-2 py-1 border-2 border-black font-bold text-xs shadow-retro hover:scale-105 transition-transform',
                            copySuccess ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-100'
                        ]"
                        :title="copySuccess ? 'Copied!' : 'Copy Message'"
                    >
                        {{ copySuccess ? '✓ Copied' : '📋 Copy' }}
                    </button>
                </div>
            </div>

            <!-- User Avatar -->
            <div v-if="message.role === 'user'" class="flex-shrink-0">
                <div class="w-6 h-6 lg:w-8 lg:h-8 bg-retro-green border-2 border-black flex items-center justify-center text-white font-bold text-xs lg:text-sm">👤</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { notifySuccess, notifyError } from '../utils/notification'
import type { Message } from '../types/chat'

interface Props {
    message: Message
    isLoading?: boolean
    showToolbar?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'toggle-toolbar': [messageId: string]
    'copy-message': [messageId: string, content: string]
}>()

const copySuccess = ref(false)

const toggleToolbar = () => {
    emit('toggle-toolbar', props.message.id)
}

const copyMessage = async () => {
    try {
        await navigator.clipboard.writeText(props.message.content)
        copySuccess.value = true
        notifySuccess('Message Copied', 'Content copied to clipboard')
        setTimeout(() => {
            copySuccess.value = false
        }, 2000)
    } catch (err) {
        console.error('Copy failed:', err)
        // Fallback solution
        const textArea = document.createElement('textarea')
        textArea.value = props.message.content
        document.body.appendChild(textArea)
        textArea.select()
        try {
            document.execCommand('copy')
            copySuccess.value = true
            notifySuccess('Message Copied', 'Content copied to clipboard')
            setTimeout(() => {
                copySuccess.value = false
            }, 2000)
        } catch (fallbackErr) {
            console.error('Fallback copy also failed:', fallbackErr)
            notifyError('Copy Failed', 'Unable to copy to clipboard, please manually select and copy')
        }
        document.body.removeChild(textArea)
    }

    emit('copy-message', props.message.id, props.message.content)
}

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
