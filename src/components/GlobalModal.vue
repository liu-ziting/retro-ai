<template>
    <Transition name="modal">
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-retro-yellow border-4 border-black shadow-retro p-6 max-w-md mx-4 relative animate-slide-up font-retro">
                <!-- Close button -->
                <button
                    @click="closeModal"
                    class="absolute top-2 right-2 w-6 h-6 bg-black text-retro-yellow font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center"
                >
                    ×
                </button>

                <!-- Modal content -->
                <div class="text-center">
                    <div class="text-lg font-bold mb-4 text-black">🤖 System Information</div>
                    <div class="text-sm text-black leading-relaxed mb-4 bg-white border-2 border-black p-3 shadow-retro-inset">
                        This system was autonomously completed by <b>Kiro</b> Editor. Humans only provided conceptual instructions and did not directly participate in any code
                        implementation.<br />
                        <span class="text-xs opacity-70">Author: https://github.com/liu-ziting/</span>
                    </div>
                    <div class="text-xs text-gray-700 text-right italic mb-4">——Kiro Editor @1983</div>

                    <!-- Button group -->
                    <div class="flex gap-3 justify-center">
                        <button @click="closeModal" class="px-4 py-2 bg-white border-2 border-black shadow-retro text-black font-bold text-sm hover:bg-gray-100 transition-colors">
                            Close
                        </button>
                        <button
                            @click="closeAndDontShowToday"
                            class="px-4 py-2 bg-black border-2 border-black shadow-retro text-retro-yellow font-bold text-sm hover:bg-gray-800 transition-colors"
                        >
                            Don't show today
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const show = ref(false)
const STORAGE_KEY = 'kiro-modal-dont-show-today'

// Check if user chose not to show today
const shouldShowToday = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return true

    const storedDate = new Date(stored)
    const today = new Date()

    // Check if it's the same day
    return storedDate.toDateString() !== today.toDateString()
}

const closeModal = () => {
    show.value = false
}

const closeAndDontShowToday = () => {
    // Save today's date to localStorage
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    show.value = false
}

const openModal = () => {
    show.value = true
}

// Check if modal should be shown when page loads
onMounted(() => {
    if (shouldShowToday()) {
        setTimeout(() => {
            show.value = true
        }, 1000) // Show after 1 second delay
    }
})

// Expose methods to parent component
defineExpose({
    openModal,
    closeModal
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .bg-retro-yellow {
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        transform: translateY(-20px) scale(0.95);
        opacity: 0;
    }
    to {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}
</style>
