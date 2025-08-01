<template>
    <!-- 移动端顶部导航栏 -->
    <div class="lg:hidden bg-retro-pink p-2 flex-shrink-0 relative z-30">
        <div class="flex items-center justify-between">
            <button @click="$emit('toggle-sidebar')" class="bg-white border-2 border-black px-2 py-1 text-sm font-bold hover:bg-gray-100 shadow-retro flex items-center gap-1">
                <span class="text-base">☰</span>
            </button>
            <div class="text-center">
                <h1 class="text-xl font-black text-white drop-shadow-lg font-mono tracking-wider flex items-center justify-center">
                    <span class="animate-pulse inline-block">💻</span>
                    <span class="mx-1">Retro</span>
                    <span class="text-cyan-300 glow-text mx-1">AI</span>
                    <span class="animate-pulse inline-block">🤖</span>
                </h1>
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
        class="w-full lg:max-w-6xl lg:mx-auto p-0 lg:p-6 flex-1 lg:flex-none flex flex-col lg:block hidden lg:block bg-retro-pink border-4 border-black shadow-retro mb-4 relative retro-header"
    >
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-4xl font-black text-white drop-shadow-lg font-mono tracking-wider relative flex items-center">
                    <span class="animate-pulse text-green-400 inline-block">▶</span>
                    <span class="typewriter">RETRO</span>
                    <span class="text-cyan-300 glow-text mx-2">BOT</span>
                    <span class="cursor-blink">█</span>
                    <span class="animate-pulse inline-block ml-2">🖥️</span>
                    <span class="absolute -top-1 -right-8 text-sm animate-ping">●</span>
                </h1>
                <p class="text-white/90 text-sm mt-1 uppercase tracking-wide font-mono">
                    <span class="animate-pulse">🕹️</span> WHERE CLASSIC CHARM MEETS AI SMARTS—CHAT THE RETRO WAY! <span class="animate-pulse">⚡</span>
                </p>
            </div>
            <div class="flex gap-2">
                <button @click="$emit('toggle-statistics')" class="bg-white border-2 border-black px-3 py-1 text-xs font-bold hover:bg-gray-100 shadow-retro">📊 Stats</button>
                <button @click="$emit('toggle-settings')" class="bg-white border-2 border-black px-3 py-1 text-xs font-bold hover:bg-gray-100 shadow-retro">⚙️ Setup</button>
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

<style scoped>
@keyframes typewriter {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0.7;
    }
}

@keyframes blink {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0;
    }
}

@keyframes glow {
    0%,
    100% {
        text-shadow: 2px 2px 0px #000, 4px 4px 0px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.2);
    }
    50% {
        text-shadow: 2px 2px 0px #000, 4px 4px 0px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 0, 0.6), 0 0 30px rgba(255, 255, 0, 0.4);
    }
}

@keyframes ai-glow {
    0%,
    100% {
        text-shadow: 2px 2px 0px #000, 4px 4px 0px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 255, 255, 0.3);
    }
    50% {
        text-shadow: 2px 2px 0px #000, 4px 4px 0px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.6);
    }
}

.typewriter {
    display: inline-block;
    animation: typewriter 2s ease-in-out infinite;
}

/* 复古电脑风格的闪烁光标 */
.cursor-blink {
    display: inline-block;
    animation: blink 1s infinite;
    color: #00ff00;
    margin-left: 4px;
    text-shadow: 0 0 10px #00ff00;
}

.glow-text {
    animation: glow 2s ease-in-out infinite;
}

.text-cyan-300.glow-text {
    animation: ai-glow 1.5s ease-in-out infinite;
}

/* 增强阴影效果 */
h1 {
    text-shadow: 2px 2px 0px #000, 4px 4px 0px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.2);
}

/* 温和的复古效果 */
.retro-header {
    background: linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #ff69b4 100%);
    position: relative;
}

.retro-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    opacity: 0.3;
}
</style>
