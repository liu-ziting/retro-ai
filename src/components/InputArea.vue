<template>
    <div class="bg-retro-purple lg:border-4 border-black lg:shadow-retro p-2 lg:p-4 border-t-2 lg:border-t-0 lg:mt-4">
        <div class="hidden lg:inline-block bg-black text-white px-2 py-1 text-sm font-bold mb-3">4. TYPE MESSAGE</div>
        <div class="flex gap-2 lg:gap-3">
            <textarea
                v-model="inputMessage"
                @keydown.enter.prevent="handleSend"
                placeholder="Input message..."
                :disabled="isLoading"
                rows="2"
                class="flex-1 p-2 lg:p-3 border-2 border-black font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-retro-yellow disabled:bg-gray-200"
            ></textarea>
            <button
                @click="handleSend"
                :disabled="!inputMessage.trim() || isLoading"
                class="px-3 lg:px-6 py-2 lg:py-3 bg-retro-green border-2 border-black font-bold text-white hover:bg-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-retro text-sm"
            >
                {{ isLoading ? 'Sending...' : 'Send' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    isLoading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
    'send-message': [message: string]
}>()

const inputMessage = ref('')

const handleSend = () => {
    if (!inputMessage.value.trim()) return

    const message = inputMessage.value.trim()
    inputMessage.value = ''
    emit('send-message', message)
}
</script>
