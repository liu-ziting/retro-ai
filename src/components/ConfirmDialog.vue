<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fade-in p-4" @click="$emit('cancel')">
        <div class="bg-white border-4 border-black shadow-retro w-full max-w-sm max-h-[90vh] flex flex-col animate-slide-up" @click.stop>
            <div class="bg-red-500 border-b-4 border-black p-4 flex-shrink-0">
                <h3 class="font-bold text-white text-lg">⚠️ Confirm Action</h3>
            </div>

            <div class="p-6 text-center flex-1 overflow-y-auto">
                <div class="text-4xl mb-4">🤔</div>
                <div class="font-bold text-lg mb-2">{{ title || 'Are you sure you want to perform this action?' }}</div>
                <div class="text-sm text-gray-600">{{ message || 'This action may be irreversible, please proceed with caution.' }}</div>
            </div>

            <div class="border-t-4 border-black p-4 flex gap-3 justify-end flex-shrink-0">
                <button @click="$emit('cancel')" class="px-4 py-2 bg-gray-300 border-2 border-black font-bold hover:bg-gray-400 shadow-retro">Cancel</button>
                <button @click="$emit('confirm')" class="px-4 py-2 bg-red-500 border-2 border-black font-bold text-white hover:bg-red-400 shadow-retro">Confirm</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    show: boolean
    title?: string
    message?: string
}

defineProps<Props>()

defineEmits<{
    confirm: []
    cancel: []
}>()
</script>
