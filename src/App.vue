<template>
    <div class="h-screen lg:h-auto bg-retro-yellow font-retro relative flex flex-col lg:block lg:min-h-screen lg:p-4">
        <!-- Header 组件 -->
        <Header @toggle-sidebar="showSidebar = !showSidebar" @toggle-statistics="showStatistics = !showStatistics" @toggle-settings="showSettings = !showSettings" />

        <!-- PC端容器 -->
        <div class="w-full lg:max-w-6xl lg:mx-auto p-0 flex-1 lg:flex-none flex flex-col lg:block">
            <div class="flex flex-col lg:grid lg:grid-cols-4 lg:gap-4 flex-1 lg:flex-none" :class="{ hidden: isFullscreen }">
                <!-- Sidebar 组件 -->
                <Sidebar
                    :show-sidebar="showSidebar"
                    :is-fullscreen="isFullscreen"
                    :sorted-sessions="sortedSessions"
                    :current-session-id="currentSessionId"
                    @close-sidebar="showSidebar = false"
                    @create-session="createNewSession"
                    @select-session="selectSession"
                    @delete-session="deleteSession"
                    @reset-sessions="resetSessions"
                />

                <!-- ChatWindow 组件 -->
                <ChatWindow
                    :current-session="currentSession"
                    :is-loading="isLoading"
                    :is-fullscreen="isFullscreen"
                    :api-config="apiConfig"
                    :preset-title="getCurrentPresetTitle()"
                    :show-toolbar="showToolbar"
                    @toggle-fullscreen="toggleFullscreen"
                    @hide-toolbar="hideToolbar"
                    @toggle-toolbar="toggleToolbar"
                    @copy-message="copyMessage"
                    @send-message="handleSend"
                    ref="chatWindowRef"
                />
            </div>
            <!-- 底部信息栏 (仅桌面端显示) -->
            <div class="hidden lg:block bg-white border-4 border-black shadow-retro mt-4 p-2 text-center">
                <div class="text-xs font-bold">
                    © 2025 RetroBot | Made with ❤️ and ☕ |
                    <a href="https://github.com/liu-ziting/" target="_blank" class="text-retro-blue hover:underline">Powered by Liuziting</a>
                </div>
            </div>
        </div>

        <!-- 模态框组件 -->
        <SettingsModal :show="showSettings" :api-config="apiConfig" @close="showSettings = false" @save="saveSettings" @reset-config="resetApiConfig" />

        <StatisticsModal :show="showStatistics" :stats="realTimeStats" @close="showStatistics = false" />

        <ConfirmDialog :show="showConfirmDialog" @confirm="executeConfirm" @cancel="showConfirmDialog = false" />

        <!-- 全局通知组件 -->
        <NotificationToast ref="notificationRef" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from './stores/chat'
import { SYSTEM_PROMPTS } from './config/prompts'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import ChatWindow from './components/ChatWindow.vue'
import SettingsModal from './components/SettingsModal.vue'
import StatisticsModal from './components/StatisticsModal.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import NotificationToast from './components/NotificationToast.vue'
import { setNotificationInstance, notifySuccess } from './utils/notification'
import type { ApiConfig } from './types/chat'

const chatStore = useChatStore()
const { sessions, currentSessionId, currentSession, sortedSessions, isLoading, apiConfig, realTimeStats } = storeToRefs(chatStore)

const showSettings = ref(false)
const showSidebar = ref(false)
const showStatistics = ref(false)
const showConfirmDialog = ref(false)
const confirmAction = ref<() => void>(() => {})
const isFullscreen = ref(false)
const showToolbar = ref<string | null>(null)
const chatWindowRef = ref()
const notificationRef = ref()

// 基础方法
const createNewSession = () => {
    chatStore.createSession()
}

const selectSession = (sessionId: string) => {
    chatStore.selectSession(sessionId)
}

const deleteSession = (sessionId: string) => {
    chatStore.deleteSession(sessionId)
}

const handleSend = async (message: string) => {
    await chatStore.sendMessage(message)
    scrollToBottom()
}

const saveSettings = (config: ApiConfig) => {
    chatStore.updateApiConfig(config)
    // 保存设置后自动创建新对话，确保新设置生效
    chatStore.createSession()
}

// 获取当前预设标题
const getCurrentPresetTitle = () => {
    const currentPrompt = apiConfig.value.systemPrompt
    if (!currentPrompt) return '自定义'

    // 检查是否匹配预设
    for (const [key, value] of Object.entries(SYSTEM_PROMPTS)) {
        if (value === currentPrompt) {
            switch (key) {
                case 'default':
                    return '🕹️ 复古'
                case 'fuck':
                    return '🔥 Fuck'
                case 'coding':
                    return '💻 编程'
                case 'creative':
                    return '🎨 创意'
                case 'academic':
                    return '� 学术'
                case 'casual':
                    return '😊 随和'
                default:
                    return '自定义'
            }
        }
    }
    return '自定义'
}

// 确认对话框
const showConfirm = (action: () => void) => {
    confirmAction.value = action
    showConfirmDialog.value = true
}

const executeConfirm = () => {
    confirmAction.value()
    showConfirmDialog.value = false
}

// 重置方法
const resetApiConfig = () => {
    showConfirm(() => {
        chatStore.resetApiConfig()
        notifySuccess('API配置已重置！', '配置已恢复为默认值')
    })
}

const resetSessions = () => {
    showConfirm(() => {
        chatStore.resetSessions()
        notifySuccess('对话记录已清空！', '所有历史对话已被删除')
    })
}

// UI 控制
const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
}

const toggleToolbar = (messageId: string) => {
    showToolbar.value = showToolbar.value === messageId ? null : messageId
}

const hideToolbar = () => {
    showToolbar.value = null
}

const copyMessage = (messageId: string, content: string) => {
    // 复制逻辑由 MessageItem 组件处理
}

const scrollToBottom = () => {
    nextTick(() => {
        const container = chatWindowRef.value?.messagesContainer
        if (container) {
            container.scrollTop = container.scrollHeight
        }
    })
}

// 监听消息变化，自动滚动到底部
watch(
    () => currentSession.value?.messages,
    () => {
        scrollToBottom()
    },
    { deep: true }
)

// 初始化
onMounted(() => {
    chatStore.loadFromStorage()
    scrollToBottom()

    // 设置全局通知实例
    if (notificationRef.value) {
        setNotificationInstance(notificationRef.value)
    }
})
</script>
