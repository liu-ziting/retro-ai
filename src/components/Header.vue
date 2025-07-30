<template>
    <!-- 移动端顶部导航栏 -->
    <div class="lg:hidden bg-retro-pink p-2 flex-shrink-0 relative z-30">
        <div class="flex items-center justify-between">
            <button @click="$emit('toggle-sidebar')" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro flex items-center gap-1">
                <span class="text-base">☰</span>
            </button>
            <div class="text-center">
                <h1 class="text-xl font-bold text-white drop-shadow-lg">Retro<span class="text-retro-yellow">Bot</span></h1>
            </div>
            <div class="flex gap-1">
                <button @click="$emit('toggle-statistics')" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro">
                    <span class="text-base">📊</span>
                </button>
                <button @click="$emit('toggle-settings')" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro">
                    <span class="text-base">⚙️</span>
                </button>
            </div>
        </div>
    </div>

    <!-- 桌面端标题栏 -->
    <div
        class="w-full lg:max-w-6xl lg:mx-auto p-0 lg:p-6 flex-1 lg:flex-none flex flex-col lg:block hidden lg:block bg-retro-pink border-4 border-black shadow-retro mb-4 relative"
    >
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-4xl font-bold text-white drop-shadow-lg">Retro<span class="text-retro-yellow">-Bot</span></h1>
                <p class="text-white/90 text-sm mt-1 uppercase tracking-wide">WHERE CLASSIC CHARM MEETS AI SMARTS—CHAT THE RETRO WAY!</p>
            </div>
            <div class="flex gap-2">
                <button @click="$emit('toggle-statistics')" class="bg-white border-2 border-black px-3 py-1 text-xs font-bold hover:bg-gray-100 shadow-retro">📊 统计</button>
                <button @click="$emit('toggle-settings')" class="bg-white border-2 border-black px-3 py-1 text-xs font-bold hover:bg-gray-100 shadow-retro">⚙️ 配置</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
    'toggle-sidebar': []
    'toggle-statistics': []
    'toggle-settings': []
}>()
</script>
