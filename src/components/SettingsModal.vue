<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4" @click="$emit('close')">
        <div class="bg-white border-4 border-black shadow-retro w-full max-w-5xl max-h-[90vh] flex flex-col animate-slide-up" @click.stop>
            <div class="bg-retro-orange border-b-4 border-black p-4 flex-shrink-0 flex items-center justify-between">
                <h3 class="font-bold text-white text-lg">⚙️ SETTINGS PANEL</h3>
                <button @click="$emit('close')" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro text-black">✕</button>
            </div>

            <!-- Scrollable content area -->
            <div class="flex-1 overflow-y-auto min-h-0">
                <div class="p-6">
                    <!-- Desktop: left-right layout, Mobile: top-bottom layout -->
                    <div class="flex flex-col lg:flex-row lg:items-stretch gap-6 max-w-6xl mx-auto">
                        <!-- Left side: Basic Configuration -->
                        <div class="flex-1">
                            <div class="bg-gray-50 p-4 border-2 border-gray-200 rounded h-full">
                                <h4 class="font-bold text-sm mb-4 text-gray-700">🔧 Basic Configuration</h4>

                                <div class="space-y-4">
                                    <div>
                                        <label class="block font-bold text-xs mb-1">🔑 API KEY:</label>
                                        <input
                                            v-model="localConfig.apiKey"
                                            type="password"
                                            placeholder="Enter your API key here..."
                                            class="w-full p-2 border-2 border-black font-bold text-xs focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                        />
                                    </div>

                                    <div>
                                        <label class="block font-bold text-xs mb-1">🌐 BASE URL:</label>
                                        <input
                                            v-model="localConfig.baseUrl"
                                            type="text"
                                            placeholder="Enter the API endpoint before chat/completions, e.g.: https://api.deepseek.com"
                                            class="w-full p-2 border-2 border-black font-bold text-xs focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                        />
                                        <div class="text-xs text-gray-600 mt-1">Enter the API endpoint before chat/completions</div>
                                    </div>

                                    <div>
                                        <label class="block font-bold text-xs mb-1">🤖 MODEL:</label>
                                        <input
                                            v-model="localConfig.model"
                                            type="text"
                                            placeholder="Enter model name, e.g.: deepseek-chat"
                                            class="w-full p-2 border-2 border-black font-bold text-xs focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                        />
                                    </div>

                                    <div>
                                        <label class="block font-bold text-xs mb-1">🌡️ TEMPERATURE:</label>
                                        <input
                                            v-model.number="localConfig.temperature"
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            placeholder="0.7"
                                            class="w-full p-2 border-2 border-black font-bold text-xs focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                        />
                                        <div class="text-xs text-gray-600 mt-1">Controls response randomness (0-1, recommended 0.7)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right side: System Prompt -->
                        <div class="flex-1">
                            <div class="bg-gray-50 p-4 border-2 border-gray-200 rounded h-full">
                                <h4 class="font-bold text-sm mb-4 text-gray-700">💬 System Prompt</h4>

                                <!-- Preset selection buttons -->
                                <div class="mb-4">
                                    <div class="text-xs font-bold mb-2 text-gray-700">📋 Quick Presets:</div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <button
                                            @click="selectPromptPreset('default')"
                                            class="px-2 py-1 bg-retro-pink border-2 border-black font-bold text-white text-xs hover:bg-pink-400 shadow-retro"
                                        >
                                            🕹️ Retro
                                        </button>
                                        <button
                                            @click="selectPromptPreset('fuck')"
                                            class="px-2 py-1 bg-retro-green border-2 border-black font-bold text-white text-xs hover:bg-green-400 shadow-retro"
                                        >
                                            🔥 Fuck
                                        </button>
                                        <button
                                            @click="selectPromptPreset('coding')"
                                            class="px-2 py-1 bg-retro-blue border-2 border-black font-bold text-white text-xs hover:bg-blue-400 shadow-retro"
                                        >
                                            💻 Coding
                                        </button>
                                        <button
                                            @click="selectPromptPreset('creative')"
                                            class="px-2 py-1 bg-retro-purple border-2 border-black font-bold text-white text-xs hover:bg-purple-400 shadow-retro"
                                        >
                                            🎨 Creative
                                        </button>
                                        <button
                                            @click="selectPromptPreset('casual')"
                                            class="px-2 py-1 bg-retro-orange border-2 border-black font-bold text-white text-xs hover:bg-orange-400 shadow-retro col-span-2"
                                        >
                                            😊 Casual
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <textarea
                                        v-model="localConfig.systemPrompt"
                                        placeholder="Enter system prompt, e.g.: You are a helpful AI assistant..."
                                        rows="7"
                                        class="w-full p-2 border-2 border-black font-bold text-xs resize-none focus:outline-none focus:ring-2 focus:ring-retro-yellow"
                                    ></textarea>
                                    <div class="text-xs text-gray-600 mt-2">Set AI's role and behavior, or click presets above for quick selection</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom buttons -->
            <div class="border-t-4 border-black p-4 bg-gray-100 flex gap-3 justify-between flex-shrink-0">
                <button @click="$emit('reset-config')" class="px-4 py-2 bg-retro-blue border-2 border-black font-bold text-white hover:bg-blue-400 shadow-retro text-sm">
                    🔧 Reset API Config
                </button>
                <button @click="saveSettings" class="px-6 py-2 bg-retro-green border-2 border-black font-bold text-white hover:bg-green-400 shadow-retro text-sm">
                    Save Settings
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { SYSTEM_PROMPTS } from '../config/prompts'
import type { ApiConfig } from '../types/chat'

interface Props {
    show: boolean
    apiConfig: ApiConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
    close: []
    save: [config: ApiConfig]
    'reset-config': []
}>()

const localConfig = ref<ApiConfig>({ ...props.apiConfig })

// 监听外部配置变化
watch(
    () => props.apiConfig,
    newConfig => {
        localConfig.value = { ...newConfig }
    },
    { deep: true }
)

const selectPromptPreset = (presetKey: keyof typeof SYSTEM_PROMPTS) => {
    localConfig.value.systemPrompt = SYSTEM_PROMPTS[presetKey]
}

const saveSettings = () => {
    emit('save', { ...localConfig.value })
    emit('close')
}
</script>
