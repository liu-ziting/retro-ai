<template>
    <Transition name="modal">
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-retro-yellow border-4 border-black shadow-retro p-6 max-w-md mx-4 relative animate-slide-up font-retro">
                <!-- 关闭按钮 -->
                <button
                    @click="closeModal"
                    class="absolute top-2 right-2 w-6 h-6 bg-black text-retro-yellow font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center"
                >
                    ×
                </button>

                <!-- 弹窗内容 -->
                <div class="text-center">
                    <div class="text-lg font-bold mb-4 text-black">🤖 系统信息</div>
                    <div class="text-sm text-black leading-relaxed mb-4 bg-white border-2 border-black p-3 shadow-retro-inset">
                        本系统由Kiro编辑器自主完成，人类仅提供概念指令，未直接参与任何代码实现。<br />
                        <span class="text-xs opacity-70">// 指令作者：https://github.com/liu-ziting/</span>
                    </div>
                    <div class="text-xs text-gray-700 text-right italic mb-4">——Kiro Editor @1983</div>

                    <!-- 按钮组 -->
                    <div class="flex gap-3 justify-center">
                        <button @click="closeModal" class="px-4 py-2 bg-white border-2 border-black shadow-retro text-black font-bold text-sm hover:bg-gray-100 transition-colors">
                            关闭
                        </button>
                        <button
                            @click="closeAndDontShowToday"
                            class="px-4 py-2 bg-black border-2 border-black shadow-retro text-retro-yellow font-bold text-sm hover:bg-gray-800 transition-colors"
                        >
                            今日不再弹出
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

// 检查今天是否已经选择不再显示
const shouldShowToday = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return true

    const storedDate = new Date(stored)
    const today = new Date()

    // 检查是否是同一天
    return storedDate.toDateString() !== today.toDateString()
}

const closeModal = () => {
    show.value = false
}

const closeAndDontShowToday = () => {
    // 保存今天的日期到localStorage
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    show.value = false
}

const openModal = () => {
    show.value = true
}

// 页面加载时检查是否应该显示弹窗
onMounted(() => {
    if (shouldShowToday()) {
        setTimeout(() => {
            show.value = true
        }, 1000) // 延迟1秒显示
    }
})

// 暴露方法给父组件
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
