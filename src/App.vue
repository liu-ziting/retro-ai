<template>
    <div class="min-h-screen bg-retro-yellow p-4 font-retro">
        <div class="max-w-6xl mx-auto">
            <!-- 主标题栏 -->
            <div class="bg-retro-pink border-4 border-black shadow-retro mb-4 p-6 relative">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-4xl font-bold text-white drop-shadow-lg">
                            DEEP
                            <span class="text-retro-yellow">FUCK</span>
                        </h1>
                        <p class="text-white/90 text-sm mt-1 uppercase tracking-wide">DEEP CONVERSATIONS! SMART INSIGHTS!</p>
                    </div>
                    <button @click="showSettings = !showSettings" class="bg-white border-2 border-black px-3 py-1 text-xs font-bold hover:bg-gray-100 shadow-retro">⚙️ 配置</button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <!-- 左侧：会话管理 -->
                <div class="lg:col-span-1">
                    <!-- 新建对话 -->
                    <div class="bg-retro-green border-4 border-black shadow-retro mb-4 p-2">
                        <div class="bg-black text-white px-2 py-1 text-xs font-bold mb-2 inline-block">1. NEW CHAT</div>
                        <button @click="createNewSession" class="w-full bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-retro font-bold text-center text-sm">
                            <div class="text-lg mb-1">💬</div>
                            <div>START NEW CHAT</div>
                        </button>
                    </div>

                    <!-- 会话列表 -->
                    <div class="bg-white border-4 border-black shadow-retro p-3">
                        <div class="bg-black text-white px-2 py-1 text-sm font-bold mb-3 inline-block">2. CHAT HISTORY</div>
                        <div class="space-y-2 max-h-64 overflow-y-auto">
                            <div
                                v-for="session in sortedSessions"
                                :key="session.id"
                                :class="[
                                    'p-3 border-2 border-black cursor-pointer font-bold text-sm relative group',
                                    session.id === currentSessionId ? 'bg-retro-yellow shadow-retro-inset' : 'bg-gray-100 hover:bg-gray-200'
                                ]"
                                @click="selectSession(session.id)"
                            >
                                <div class="truncate">{{ session.title }}</div>
                                <div class="text-xs text-gray-600 mt-1">{{ formatTime(session.updatedAt) }}</div>
                                <button
                                    v-if="sessions.length > 1"
                                    @click.stop="deleteSession(session.id)"
                                    class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white text-xs px-1 rounded"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <!-- 清空对话按钮 -->
                        <div class="mt-3 pt-3 border-t-2 border-gray-200">
                            <button
                                @click="resetSessions"
                                class="w-full px-3 py-2 bg-retro-orange border-2 border-black font-bold text-white hover:bg-orange-400 shadow-retro text-sm flex items-center justify-center gap-2"
                            >
                                <span>🗑️</span> 清空对话记录
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 右侧：聊天区域 -->
                <div class="lg:col-span-3">
                    <!-- 聊天窗口 -->
                    <div class="bg-white border-4 border-black shadow-retro mb-4">
                        <div class="bg-black text-white px-2 py-1 text-sm font-bold mb-0 flex items-center justify-between">
                            <span>3. CHAT WINDOW</span>
                            <span class="text-xs">{{ currentSession?.title || 'No Chat Selected' }}</span>
                        </div>

                        <div
                            ref="messagesContainer"
                            class="h-96 overflow-y-auto p-4 bg-gray-50"
                            style="background-image: repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0, 0, 0, 0.03) 20px, rgba(0, 0, 0, 0.03) 21px)"
                        >
                            <!-- 欢迎消息 -->
                            <div v-if="!currentSession?.messages.length" class="text-center py-16">
                                <div class="text-6xl mb-4 animate-bounce-slow">🤖</div>
                                <div class="font-bold text-lg mb-2">WAITING FOR INPUT...</div>
                                <div class="text-sm text-gray-600">Start a conversation to see the magic!</div>
                            </div>

                            <!-- 消息列表 -->
                            <div v-for="message in currentSession?.messages" :key="message.id" class="mb-4 animate-slide-up">
                                <div :class="['flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start']">
                                    <!-- AI头像 -->
                                    <div v-if="message.role === 'assistant'" class="flex-shrink-0">
                                        <div class="w-8 h-8 bg-retro-blue border-2 border-black flex items-center justify-center text-white font-bold">🤖</div>
                                    </div>

                                    <!-- 消息气泡 -->
                                    <div
                                        :class="[
                                            'max-w-[70%] p-3 border-2 border-black font-bold text-sm',
                                            message.role === 'user' ? 'bg-retro-pink text-white shadow-retro' : 'bg-white shadow-retro'
                                        ]"
                                    >
                                        <!-- 消息内容或加载动画 -->
                                        <div v-if="message.content && message.content.trim()" class="whitespace-pre-wrap">
                                            {{ message.content }}
                                        </div>
                                        <div
                                            v-else-if="message.role === 'assistant' && (!message.content || message.content.trim() === '') && isLoading"
                                            class="flex items-center gap-1"
                                        >
                                            <div class="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                                            <div class="w-2 h-2 bg-black rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                            <div class="w-2 h-2 bg-black rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                                        </div>

                                        <!-- 时间戳 -->
                                        <div
                                            v-if="message.content && message.content.trim()"
                                            :class="['text-xs mt-2 opacity-75', message.role === 'user' ? 'text-right text-white' : 'text-left text-gray-600']"
                                        >
                                            {{ formatTime(message.timestamp) }}
                                        </div>
                                    </div>

                                    <!-- 用户头像 -->
                                    <div v-if="message.role === 'user'" class="flex-shrink-0">
                                        <div class="w-8 h-8 bg-retro-green border-2 border-black flex items-center justify-center text-white font-bold">👤</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 输入区域 -->
                    <div class="bg-retro-purple border-4 border-black shadow-retro p-4">
                        <div class="bg-black text-white px-2 py-1 text-sm font-bold mb-3 inline-block">4. TYPE MESSAGE</div>
                        <div class="flex gap-3">
                            <textarea
                                v-model="inputMessage"
                                @keydown.enter.prevent="handleSend"
                                placeholder="Type your message here..."
                                :disabled="isLoading"
                                rows="3"
                                class="flex-1 p-3 border-2 border-black font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-retro-yellow disabled:bg-gray-200"
                            ></textarea>
                            <button
                                @click="handleSend"
                                :disabled="!inputMessage.trim() || isLoading"
                                class="px-6 py-3 bg-retro-green border-2 border-black font-bold text-white hover:bg-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-retro"
                            >
                                {{ isLoading ? 'SENDING...' : 'SEND!' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部信息栏 -->
            <div class="bg-white border-4 border-black shadow-retro mt-4 p-2 text-center">
                <div class="text-xs font-bold">
                    © 2025 DeepFuck | Made with ❤️ and ☕ |
                    <a href="https://github.com/liu-ziting/" target="_blank" class="text-retro-blue hover:underline">Powered by Liuziting</a>
                </div>
            </div>
        </div>

        <!-- 设置面板 -->
        <div v-if="showSettings" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4" @click="showSettings = false">
            <div class="bg-white border-4 border-black shadow-retro w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up" @click.stop>
                <div class="bg-retro-orange border-b-4 border-black p-4 flex-shrink-0">
                    <h3 class="font-bold text-white text-lg">⚙️ SETTINGS PANEL</h3>
                </div>

                <!-- 可滚动内容区域 -->
                <div class="flex-1 overflow-y-auto min-h-0">
                    <div class="p-6">
                        <div class="space-y-4 max-w-2xl mx-auto">
                            <div class="bg-gray-50 p-3 border-2 border-gray-200 rounded">
                                <h4 class="font-bold text-sm mb-3 text-gray-700">🔧 基本配置</h4>

                                <div class="space-y-3">
                                    <div>
                                        <label class="block font-bold text-xs mb-1">🔑 API KEY:</label>
                                        <input
                                            v-model="apiConfig.apiKey"
                                            type="password"
                                            placeholder="Enter your API key here..."
                                            class="w-full p-2 border-2 border-black font-bold text-xs focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                        />
                                    </div>

                                    <div>
                                        <label class="block font-bold text-xs mb-1">🌐 BASE URL:</label>
                                        <input
                                            v-model="apiConfig.baseUrl"
                                            type="text"
                                            placeholder="API base URL..."
                                            class="w-full p-2 border-2 border-black font-bold text-xs focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                        />
                                    </div>

                                    <div>
                                        <label class="block font-bold text-xs mb-1">🤖 MODEL:</label>
                                        <input
                                            v-model="apiConfig.model"
                                            type="text"
                                            placeholder="输入模型名称，如：deepseek-chat"
                                            class="w-full p-2 border-2 border-black font-bold text-xs focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                        />
                                    </div>

                                    <div>
                                        <label class="block font-bold text-xs mb-1">🌡️ TEMPERATURE:</label>
                                        <input
                                            v-model.number="apiConfig.temperature"
                                            type="number"
                                            min="0"
                                            max="2"
                                            step="0.1"
                                            placeholder="0.7"
                                            class="w-full p-2 border-2 border-black font-bold text-xs focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                        />
                                        <div class="text-xs text-gray-600 mt-1">控制回复的随机性 (0-2，推荐0.7)</div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-3 border-2 border-gray-200 rounded">
                                <h4 class="font-bold text-sm mb-3 text-gray-700">💬 系统提示词</h4>
                                <textarea
                                    v-model="apiConfig.systemPrompt"
                                    placeholder="输入系统提示词，如：你是一个有用的AI助手..."
                                    rows="4"
                                    class="w-full p-2 border-2 border-black font-bold text-xs resize-none focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                ></textarea>
                                <div class="text-xs text-gray-600 mt-1">设置AI的角色和行为方式</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部按钮 -->
                <div class="border-t-4 border-black p-4 bg-gray-100 flex gap-3 justify-between flex-shrink-0">
                    <button @click="resetApiConfig" class="px-4 py-2 bg-retro-blue border-2 border-black font-bold text-white hover:bg-blue-400 shadow-retro text-sm">
                        🔧 重置API配置
                    </button>
                    <div class="flex gap-3">
                        <button @click="showSettings = false" class="px-6 py-2 bg-gray-300 border-2 border-black font-bold hover:bg-gray-400 shadow-retro text-sm">取消</button>
                        <button @click="saveSettings" class="px-6 py-2 bg-retro-green border-2 border-black font-bold text-white hover:bg-green-400 shadow-retro text-sm">
                            保存设置
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 确认对话框 -->
        <div v-if="showConfirmDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4" @click="showConfirmDialog = false">
            <div class="bg-white border-4 border-black shadow-retro w-full max-w-sm max-h-[90vh] flex flex-col animate-slide-up" @click.stop>
                <div class="bg-red-500 border-b-4 border-black p-4 flex-shrink-0">
                    <h3 class="font-bold text-white text-lg">⚠️ 确认操作</h3>
                </div>

                <div class="p-6 text-center flex-1 overflow-y-auto">
                    <div class="text-4xl mb-4">🤔</div>
                    <div class="font-bold text-lg mb-2">确定要执行此操作吗？</div>
                    <div class="text-sm text-gray-600">此操作可能不可撤销，请谨慎操作。</div>
                </div>

                <div class="border-t-4 border-black p-4 flex gap-3 justify-end flex-shrink-0">
                    <button @click="showConfirmDialog = false" class="px-4 py-2 bg-gray-300 border-2 border-black font-bold hover:bg-gray-400 shadow-retro">取消</button>
                    <button @click="executeConfirm" class="px-4 py-2 bg-red-500 border-2 border-black font-bold text-white hover:bg-red-400 shadow-retro">确认</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from './stores/chat'

const chatStore = useChatStore()
const { sessions, currentSessionId, currentSession, sortedSessions, isLoading, apiConfig } = storeToRefs(chatStore)

const inputMessage = ref('')
const showSettings = ref(false)
const showSidebar = ref(false)
const messagesContainer = ref<HTMLElement>()
const showConfirmDialog = ref(false)
const confirmAction = ref<() => void>(() => {})

// 方法
const createNewSession = () => {
    chatStore.createSession()
}

const selectSession = (sessionId: string) => {
    chatStore.selectSession(sessionId)
}

const deleteSession = (sessionId: string) => {
    chatStore.deleteSession(sessionId)
}

const handleSend = async () => {
    if (!inputMessage.value.trim() || isLoading.value) return

    const message = inputMessage.value.trim()
    inputMessage.value = ''

    await chatStore.sendMessage(message)
    scrollToBottom()
}

const saveSettings = () => {
    chatStore.updateApiConfig(apiConfig.value)
    showSettings.value = false
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
        alert('API配置已重置！')
    })
}

const resetSessions = () => {
    showConfirm(() => {
        chatStore.resetSessions()
        alert('对话记录已清空！')
    })
}

const resetAllConfig = () => {
    showConfirm(() => {
        chatStore.resetAllConfig()
        alert('所有设置已重置！')
    })
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

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
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
})
</script>
