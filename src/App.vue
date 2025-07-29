<template>
    <div class="h-screen lg:h-auto bg-retro-yellow font-retro relative flex flex-col lg:block lg:min-h-screen">
        <!-- 移动端顶部导航栏 -->
        <div class="lg:hidden bg-retro-pink p-2 flex-shrink-0 relative z-30">
            <div class="flex items-center justify-between">
                <button
                    @click="showSidebar = !showSidebar"
                    class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro flex items-center gap-1"
                >
                    <span class="text-base">☰</span>
                </button>
                <div class="text-center">
                    <h1 class="text-xl font-bold text-white drop-shadow-lg">Retro<span class="text-retro-yellow">Bot</span></h1>
                </div>
                <button @click="showSettings = !showSettings" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro">
                    <span class="text-base">⚙️</span>
                </button>
            </div>
        </div>

        <!-- PC端容器 -->
        <div class="w-full lg:max-w-6xl lg:mx-auto p-0 lg:p-4 flex-1 lg:flex-none flex flex-col lg:block">
            <!-- 桌面端标题栏 -->
            <div class="hidden lg:block bg-retro-pink border-4 border-black shadow-retro mb-4 p-6 relative">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-4xl font-bold text-white drop-shadow-lg">
                            Retro
                            <span class="text-retro-yellow">Bot</span>
                        </h1>
                        <p class="text-white/90 text-sm mt-1 uppercase tracking-wide">DEEP CONVERSATIONS! SMART INSIGHTS!</p>
                    </div>
                    <button @click="showSettings = !showSettings" class="bg-white border-2 border-black px-3 py-1 text-xs font-bold hover:bg-gray-100 shadow-retro">⚙️ 配置</button>
                </div>
            </div>
            <div class="flex flex-col lg:grid lg:grid-cols-4 lg:gap-4 flex-1 lg:flex-none">
                <!-- 侧边栏抽屉 (移动端) -->
                <div v-if="showSidebar" class="lg:hidden fixed inset-0 bg-black/50 z-40" @click="showSidebar = false">
                    <div class="w-80 max-w-[85vw] h-full bg-retro-yellow border-r-4 border-black shadow-retro p-4 overflow-y-auto" @click.stop>
                        <!-- 抽屉头部 -->
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xl font-bold">菜单</h2>
                            <button @click="showSidebar = false" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro">✕</button>
                        </div>

                        <!-- 新建对话 -->
                        <button
                            @click="createNewSessionAndCloseSidebar"
                            class="w-full bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-retro font-bold text-center text-sm"
                        >
                            <div class="text-base mb-1">💬</div>
                            <div>新建对话</div>
                        </button>

                        <!-- 会话列表 -->
                        <div class="bg-white border-2 border-black shadow-retro p-3">
                            <div class="bg-black text-white px-2 py-1 text-xs font-bold mb-3 inline-block">对话历史</div>
                            <div class="space-y-2 max-h-96 overflow-y-scroll scrollbar-hide">
                                <div
                                    v-for="session in sortedSessions"
                                    :key="session.id"
                                    :class="[
                                        'p-2 border-2 border-black cursor-pointer font-bold text-xs relative group',
                                        session.id === currentSessionId ? 'bg-retro-yellow shadow-retro-inset' : 'bg-gray-100 hover:bg-gray-200'
                                    ]"
                                    @click="selectSessionAndCloseSidebar(session.id)"
                                >
                                    <div class="truncate">{{ session.title }}</div>
                                    <div class="text-xs text-gray-600 mt-1">{{ formatTime(session.updatedAt) }}</div>
                                    <button
                                        v-if="sessions.length > 1"
                                        @click.stop="deleteSession(session.id)"
                                        class="absolute top-1 right-1 opacity-100 bg-red-500 text-white text-xs px-1 rounded"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            <!-- 清空对话按钮 -->
                            <div class="mt-3 pt-3 border-t-2 border-gray-200">
                                <button
                                    @click="resetSessions"
                                    class="w-full px-2 py-2 bg-retro-orange border-2 border-black font-bold text-white hover:bg-orange-400 shadow-retro text-xs flex items-center justify-center gap-2"
                                >
                                    <span>🗑️</span> 清空记录
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 桌面端侧边栏 -->
                <div class="hidden lg:block lg:col-span-1">
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
                        <div class="space-y-2 max-h-64 overflow-y-scroll scrollbar-hide">
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

                <!-- 主要聊天区域 -->
                <div class="w-full lg:col-span-3 flex flex-col flex-1 lg:flex-none lg:h-auto">
                    <!-- 聊天窗口 -->
                    <div class="bg-white lg:border-4 border-black lg:shadow-retro lg:mb-4 flex-1 lg:flex-none flex flex-col min-h-0">
                        <!-- 桌面端标题栏 -->
                        <div class="hidden lg:flex bg-black text-white px-2 py-1 text-sm font-bold mb-0 items-center justify-between">
                            <span>3. CHAT WINDOW</span>
                            <span class="text-xs">{{ currentSession?.title || 'No Chat Selected' }}</span>
                        </div>

                        <!-- 移动端对话标题栏 -->
                        <!-- <div class="lg:hidden bg-gray-100 px-2 py-1 text-center flex-shrink-0">
                            <div class="text-xs font-bold text-gray-700 truncate">
                                {{ currentSession?.title || '新对话' }}
                            </div>
                        </div> -->

                        <!-- 模型和预设信息栏 -->
                        <div
                            class="bg-retro-blue lg:border-b-2 border-black px-2 py-1 lg:px-3 lg:py-2 flex items-center justify-between text-white text-xs font-bold flex-shrink-0"
                        >
                            <div class="flex items-center gap-2 lg:gap-3">
                                <span class="bg-black px-2 py-1 rounded text-xs">🤖 {{ apiConfig.model || 'No Model' }}</span>
                                <span class="bg-black px-2 py-1 rounded text-xs hidden sm:inline">{{ getCurrentPresetTitle() }}</span>
                            </div>
                            <div class="text-xs opacity-75">🌡️ {{ apiConfig.temperature || 0.7 }}</div>
                        </div>

                        <div
                            ref="messagesContainer"
                            class="overflow-y-auto p-2 lg:p-4 bg-gray-50 custom-scrollbar h-[calc(100vh-115px)] lg:h-96 pb-20 lg:pb-4"
                            style="background-image: repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0, 0, 0, 0.03) 20px, rgba(0, 0, 0, 0.03) 21px)"
                        >
                            <!-- 欢迎消息 -->
                            <div v-if="!currentSession?.messages.length" class="text-center py-8 lg:py-16">
                                <div class="text-4xl lg:text-6xl mb-4 animate-bounce-slow">🤖</div>
                                <div class="font-bold text-base lg:text-lg mb-2">WAITING FOR INPUT...</div>
                                <div class="text-xs lg:text-sm text-gray-600 px-4">Start a conversation to see the magic!</div>
                            </div>

                            <!-- 消息列表 -->
                            <div v-for="message in currentSession?.messages" :key="message.id" class="mb-3 lg:mb-4 animate-slide-up">
                                <div :class="['flex gap-2 lg:gap-3', message.role === 'user' ? 'justify-end' : 'justify-start']">
                                    <!-- AI头像 -->
                                    <div v-if="message.role === 'assistant'" class="flex-shrink-0">
                                        <div
                                            class="w-6 h-6 lg:w-8 lg:h-8 bg-retro-blue border-2 border-black flex items-center justify-center text-white font-bold text-xs lg:text-sm"
                                        >
                                            🤖
                                        </div>
                                    </div>

                                    <!-- 消息气泡 -->
                                    <div
                                        :class="[
                                            'max-w-[85%] lg:max-w-[70%] p-2 lg:p-3 border-2 border-black font-bold text-xs lg:text-sm',
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
                                        <div
                                            class="w-6 h-6 lg:w-8 lg:h-8 bg-retro-green border-2 border-black flex items-center justify-center text-white font-bold text-xs lg:text-sm"
                                        >
                                            👤
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 输入区域 -->
                    <div
                        class="bg-retro-purple lg:border-4 border-black lg:shadow-retro p-2 lg:p-4 border-t-2 lg:border-t-0 flex-shrink-0 lg:relative fixed lg:static bottom-0 left-0 right-0 lg:bottom-auto lg:left-auto lg:right-auto z-20"
                    >
                        <div class="hidden lg:inline-block bg-black text-white px-2 py-1 text-sm font-bold mb-3">4. TYPE MESSAGE</div>
                        <div class="flex gap-2 lg:gap-3">
                            <!-- 移动端新建对话快捷按钮 -->

                            <textarea
                                v-model="inputMessage"
                                @keydown.enter.prevent="handleSend"
                                placeholder="输入消息..."
                                :disabled="isLoading"
                                rows="2"
                                class="flex-1 p-2 lg:p-3 border-2 border-black font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-retro-yellow disabled:bg-gray-200"
                            ></textarea>
                            <button
                                @click="handleSend"
                                :disabled="!inputMessage.trim() || isLoading"
                                class="px-3 lg:px-6 py-2 lg:py-3 bg-retro-green border-2 border-black font-bold text-white hover:bg-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-retro text-sm"
                            >
                                {{ isLoading ? '发送中...' : '发送' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部信息栏 (仅桌面端显示) -->
            <div class="hidden lg:block bg-white border-4 border-black shadow-retro mt-4 p-2 text-center">
                <div class="text-xs font-bold">
                    © 2025 RetroBot | Made with ❤️ and ☕ |
                    <a href="https://github.com/liu-ziting/" target="_blank" class="text-retro-blue hover:underline">Powered by Liuziting</a>
                </div>
            </div>
        </div>

        <!-- 设置面板 -->
        <div v-if="showSettings" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4" @click="showSettings = false">
            <div class="bg-white border-4 border-black shadow-retro w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up" @click.stop>
                <div class="bg-retro-orange border-b-4 border-black p-4 flex-shrink-0 flex items-center justify-between">
                    <h3 class="font-bold text-white text-lg">⚙️ SETTINGS PANEL</h3>
                    <button @click="showSettings = false" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro text-black">✕</button>
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
                                            placeholder="请填写 chat/completions 之前的接口地址，如：https://api.deepseek.com"
                                            class="w-full p-2 border-2 border-black font-bold text-xs focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                        />
                                        <div class="text-xs text-gray-600 mt-1">请填写 chat/completions 之前的接口地址</div>
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

                                <!-- 预设选择按钮 -->
                                <div class="mb-3">
                                    <div class="text-xs font-bold mb-2 text-gray-700">📋 快速预设：</div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <button
                                            @click="selectPromptPreset('default')"
                                            class="px-2 py-1 bg-retro-pink border-2 border-black font-bold text-white text-xs hover:bg-pink-400 shadow-retro"
                                        >
                                            🔥 Fuck
                                        </button>
                                        <button
                                            @click="selectPromptPreset('coding')"
                                            class="px-2 py-1 bg-retro-blue border-2 border-black font-bold text-white text-xs hover:bg-blue-400 shadow-retro"
                                        >
                                            💻 编程
                                        </button>
                                        <button
                                            @click="selectPromptPreset('creative')"
                                            class="px-2 py-1 bg-retro-purple border-2 border-black font-bold text-white text-xs hover:bg-purple-400 shadow-retro"
                                        >
                                            🎨 创意
                                        </button>
                                        <button
                                            @click="selectPromptPreset('academic')"
                                            class="px-2 py-1 bg-retro-green border-2 border-black font-bold text-white text-xs hover:bg-green-400 shadow-retro"
                                        >
                                            📚 学术
                                        </button>
                                        <button
                                            @click="selectPromptPreset('casual')"
                                            class="px-2 py-1 bg-retro-orange border-2 border-black font-bold text-white text-xs hover:bg-orange-400 shadow-retro col-span-2"
                                        >
                                            😊 随和
                                        </button>
                                    </div>
                                </div>

                                <textarea
                                    v-model="apiConfig.systemPrompt"
                                    placeholder="输入系统提示词，如：你是一个有用的AI助手..."
                                    rows="4"
                                    class="w-full p-2 border-2 border-black font-bold text-xs resize-none focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                ></textarea>
                                <div class="text-xs text-gray-600 mt-1">设置AI的角色和行为方式，或点击上方预设快速选择</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部按钮 -->
                <div class="border-t-4 border-black p-4 bg-gray-100 flex gap-3 justify-between flex-shrink-0">
                    <button @click="resetApiConfig" class="px-4 py-2 bg-retro-blue border-2 border-black font-bold text-white hover:bg-blue-400 shadow-retro text-sm">
                        🔧 重置API配置
                    </button>
                    <button @click="saveSettings" class="px-6 py-2 bg-retro-green border-2 border-black font-bold text-white hover:bg-green-400 shadow-retro text-sm">
                        保存设置
                    </button>
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
import { SYSTEM_PROMPTS } from './config/prompts'

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

const createNewSessionAndCloseSidebar = () => {
    chatStore.createSession()
    showSidebar.value = false
}

const selectSession = (sessionId: string) => {
    chatStore.selectSession(sessionId)
}

const selectSessionAndCloseSidebar = (sessionId: string) => {
    chatStore.selectSession(sessionId)
    showSidebar.value = false
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
    // 保存设置后自动创建新对话，确保新设置生效
    chatStore.createSession()
}

// 选择提示词预设
const selectPromptPreset = (presetKey: keyof typeof SYSTEM_PROMPTS) => {
    apiConfig.value.systemPrompt = SYSTEM_PROMPTS[presetKey]
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
                    return '🔥 Fuck'
                case 'coding':
                    return '💻 编程'
                case 'creative':
                    return '🎨 创意'
                case 'academic':
                    return '📚 学术'
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
