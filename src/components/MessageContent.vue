<template>
    <div class="message-content">
        <div v-for="(part, index) in parsedContent" :key="index" class="content-part">
            <!-- 文本内容 -->
            <div v-if="part.type === 'text'" class="whitespace-pre-wrap">{{ part.content }}</div>

            <!-- 图片链接 -->
            <div v-else-if="part.type === 'image-url'" class="image-container my-2">
                <img
                    :src="part.content"
                    :alt="part.alt || 'Generated Image'"
                    class="max-w-full h-auto border-2 border-black shadow-retro rounded cursor-pointer hover:scale-105 transition-transform"
                    @click="openImageModal(part.content, part.alt)"
                    @error="handleImageError"
                    loading="lazy"
                />
                <div v-if="part.alt" class="text-xs text-gray-600 mt-1 italic">{{ part.alt }}</div>
            </div>

            <!-- Base64图片 -->
            <div v-else-if="part.type === 'image-base64'" class="image-container my-2">
                <img
                    :src="part.content"
                    :alt="part.alt || 'Generated Image'"
                    class="max-w-full h-auto border-2 border-black shadow-retro rounded cursor-pointer hover:scale-105 transition-transform"
                    @click="openImageModal(part.content, part.alt)"
                    @error="handleImageError"
                    loading="lazy"
                />
                <div v-if="part.alt" class="text-xs text-gray-600 mt-1 italic">{{ part.alt }}</div>
            </div>

            <!-- 链接 -->
            <div v-else-if="part.type === 'link'" class="inline">
                <a :href="part.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-bold">
                    {{ part.text }}
                </a>
            </div>
        </div>
    </div>

    <!-- 图片预览模态框 -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" @click="closeImageModal">
        <div class="relative">
            <img
                :src="modalImageSrc"
                :alt="modalImageAlt"
                class="max-w-[70vw] max-h-[70vh] object-contain border-2 border-white shadow-2xl rounded"
                style="max-width: 500px; max-height: 400px"
            />
            <button
                @click="closeImageModal"
                class="absolute -top-2 -right-2 bg-white text-black w-8 h-8 border-2 border-black font-bold text-sm hover:bg-gray-100 rounded-full flex items-center justify-center"
            >
                ✕
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    content: string
}

const props = defineProps<Props>()

const showImageModal = ref(false)
const modalImageSrc = ref('')
const modalImageAlt = ref('')

interface ContentPart {
    type: 'text' | 'image-url' | 'image-base64' | 'link'
    content: string
    url?: string
    text?: string
    alt?: string
}

const parsedContent = computed(() => {
    const parts: ContentPart[] = []
    const content = props.content

    // 正则表达式匹配不同类型的内容
    const patterns = {
        // 匹配markdown链接格式 [text](url)
        markdownLink: /\[([^\]]+)\]\(([^)]+)\)/g,
        // 匹配图片URL (http/https开头，以图片扩展名结尾)
        imageUrl: /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?)/gi,
        // 匹配base64图片
        base64Image: /(data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)/g,
        // 匹配普通URL
        url: /(https?:\/\/[^\s]+)/g
    }

    let lastIndex = 0
    const matches: Array<{ index: number; length: number; part: ContentPart }> = []

    // 查找markdown链接
    let match
    while ((match = patterns.markdownLink.exec(content)) !== null) {
        const linkText = match[1]
        const linkUrl = match[2]

        // 检查是否是图片链接
        if (isImageUrl(linkUrl)) {
            matches.push({
                index: match.index,
                length: match[0].length,
                part: {
                    type: 'image-url',
                    content: linkUrl,
                    alt: linkText
                }
            })
        } else {
            matches.push({
                index: match.index,
                length: match[0].length,
                part: {
                    type: 'link',
                    content: linkText,
                    url: linkUrl,
                    text: linkText
                }
            })
        }
    }

    // 重置正则表达式
    patterns.markdownLink.lastIndex = 0

    // 查找base64图片
    while ((match = patterns.base64Image.exec(content)) !== null) {
        // 检查这个位置是否已经被markdown链接占用
        const isOverlapping = matches.some(m => match.index >= m.index && match.index < m.index + m.length)

        if (!isOverlapping) {
            matches.push({
                index: match.index,
                length: match[0].length,
                part: {
                    type: 'image-base64',
                    content: match[0]
                }
            })
        }
    }

    // 查找独立的图片URL（不在markdown链接中的）
    patterns.base64Image.lastIndex = 0
    while ((match = patterns.imageUrl.exec(content)) !== null) {
        // 检查这个位置是否已经被其他匹配占用
        const isOverlapping = matches.some(m => match.index >= m.index && match.index < m.index + m.length)

        if (!isOverlapping) {
            matches.push({
                index: match.index,
                length: match[0].length,
                part: {
                    type: 'image-url',
                    content: match[0]
                }
            })
        }
    }

    // 按位置排序
    matches.sort((a, b) => a.index - b.index)

    // 构建最终的parts数组
    let currentIndex = 0

    for (const match of matches) {
        // 添加匹配前的文本
        if (match.index > currentIndex) {
            const textContent = content.slice(currentIndex, match.index)
            if (textContent.trim()) {
                parts.push({
                    type: 'text',
                    content: textContent
                })
            }
        }

        // 添加匹配的内容
        parts.push(match.part)
        currentIndex = match.index + match.length
    }

    // 添加剩余的文本
    if (currentIndex < content.length) {
        const textContent = content.slice(currentIndex)
        if (textContent.trim()) {
            parts.push({
                type: 'text',
                content: textContent
            })
        }
    }

    // 如果没有找到任何特殊内容，返回原始文本
    if (parts.length === 0) {
        parts.push({
            type: 'text',
            content: content
        })
    }

    return parts
})

const isImageUrl = (url: string): boolean => {
    return (
        /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) ||
        url.includes('image.pollinations.ai') ||
        url.includes('images.') ||
        url.includes('/image/') ||
        url.includes('data:image/')
    )
}

const openImageModal = (src: string, alt?: string) => {
    modalImageSrc.value = src
    modalImageAlt.value = alt || 'Generated Image'
    showImageModal.value = true
}

const closeImageModal = () => {
    showImageModal.value = false
    modalImageSrc.value = ''
    modalImageAlt.value = ''
}

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.style.display = 'none'

    // 创建一个错误提示
    const errorDiv = document.createElement('div')
    errorDiv.className = 'bg-red-100 border-2 border-red-500 p-2 text-red-700 text-sm'
    errorDiv.textContent = '图片加载失败'
    img.parentNode?.insertBefore(errorDiv, img.nextSibling)
}
</script>

<style scoped>
.message-content {
    line-height: 1.5;
}

.content-part {
    margin-bottom: 0.25rem;
}

.content-part:last-child {
    margin-bottom: 0;
}

.image-container {
    max-width: 100%;
}

.image-container img {
    max-width: 300px;
    max-height: 300px;
    object-fit: contain;
}

@media (max-width: 768px) {
    .image-container img {
        max-width: 250px;
        max-height: 250px;
    }
}
</style>
