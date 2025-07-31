<template>
    <Teleport to="body">
        <div class="fixed top-4 right-4 z-[70] space-y-3 pointer-events-none">
            <TransitionGroup name="toast" tag="div" class="space-y-3">
                <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="bg-white border-4 border-black shadow-retro min-w-80 max-w-96 pointer-events-auto animate-slide-in-right"
                    :class="getNotificationClass(notification.type)"
                >
                    <!-- 头部 -->
                    <div class="flex items-center justify-between p-3 border-b-4 border-black" :class="getHeaderClass(notification.type)">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">{{ getIcon(notification.type) }}</span>
                            <span class="font-bold text-white text-sm">{{ getTitle(notification.type) }}</span>
                        </div>
                        <button
                            @click="removeNotification(notification.id)"
                            class="bg-white border-2 border-black px-2 py-1 text-xs font-bold hover:bg-gray-100 shadow-retro text-black"
                        >
                            ✕
                        </button>
                    </div>

                    <!-- 内容 -->
                    <div class="p-4">
                        <div class="font-bold text-sm text-gray-800">{{ notification.message }}</div>
                        <div v-if="notification.description" class="text-xs text-gray-600 mt-1">
                            {{ notification.description }}
                        </div>
                    </div>

                    <!-- 进度条 -->
                    <div v-if="notification.duration > 0" class="h-1 bg-gray-200 border-t-2 border-black">
                        <div class="h-full transition-all ease-linear" :class="getProgressClass(notification.type)" :style="{ width: `${notification.progress}%` }"></div>
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export interface NotificationItem {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    description?: string
    duration: number
    progress: number
    timer?: number
}

const notifications = ref<NotificationItem[]>([])

const getIcon = (type: string) => {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }
    return icons[type as keyof typeof icons] || 'ℹ️'
}

const getTitle = (type: string) => {
    const titles = {
        success: 'SUCCESS',
        error: 'ERROR',
        warning: 'WARNING',
        info: 'INFO'
    }
    return titles[type as keyof typeof titles] || 'INFO'
}

const getHeaderClass = (type: string) => {
    const classes = {
        success: 'bg-retro-green',
        error: 'bg-red-500',
        warning: 'bg-retro-orange',
        info: 'bg-retro-blue'
    }
    return classes[type as keyof typeof classes] || 'bg-retro-blue'
}

const getNotificationClass = (type: string) => {
    const classes = {
        success: 'border-retro-green',
        error: 'border-red-500',
        warning: 'border-retro-orange',
        info: 'border-retro-blue'
    }
    return classes[type as keyof typeof classes] || 'border-retro-blue'
}

const getProgressClass = (type: string) => {
    const classes = {
        success: 'bg-retro-green',
        error: 'bg-red-500',
        warning: 'bg-retro-orange',
        info: 'bg-retro-blue'
    }
    return classes[type as keyof typeof classes] || 'bg-retro-blue'
}

const addNotification = (notification: Omit<NotificationItem, 'id' | 'progress' | 'timer'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: NotificationItem = {
        ...notification,
        id,
        progress: 100
    }

    notifications.value.push(newNotification)

    if (notification.duration > 0) {
        startTimer(newNotification)
    }

    return id
}

const startTimer = (notification: NotificationItem) => {
    const startTime = Date.now()
    const duration = notification.duration

    const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, duration - elapsed)
        notification.progress = (remaining / duration) * 100

        if (remaining > 0) {
            notification.timer = requestAnimationFrame(updateProgress)
        } else {
            removeNotification(notification.id)
        }
    }

    notification.timer = requestAnimationFrame(updateProgress)
}

const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
        const notification = notifications.value[index]
        if (notification.timer) {
            cancelAnimationFrame(notification.timer)
        }
        notifications.value.splice(index, 1)
    }
}

const clearAll = () => {
    notifications.value.forEach(notification => {
        if (notification.timer) {
            cancelAnimationFrame(notification.timer)
        }
    })
    notifications.value = []
}

// 暴露方法给外部使用
defineExpose({
    addNotification,
    removeNotification,
    clearAll
})

onUnmounted(() => {
    clearAll()
})
</script>

<style scoped>
/* 动画效果 */
.toast-enter-active {
    transition: all 0.3s ease-out;
}

.toast-leave-active {
    transition: all 0.3s ease-in;
}

.toast-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.toast-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.toast-move {
    transition: transform 0.3s ease;
}

@keyframes slide-in-right {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
}
</style>
