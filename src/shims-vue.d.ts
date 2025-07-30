declare module 'vue' {
    // 重新导出 Vue 3 的所有 API
    export * from '@vue/runtime-dom'

    // 明确声明常用的 API
    export declare function ref<T = any>(value?: T): import('@vue/reactivity').Ref<T>
    export declare function reactive<T extends object>(target: T): import('@vue/reactivity').UnwrapNestedRefs<T>
    export declare function computed<T>(getter: () => T): import('@vue/reactivity').ComputedRef<T>
    export declare function watch<T>(source: T | (() => T), callback: (newValue: T, oldValue: T) => void, options?: any): void
    export declare function nextTick(fn?: () => void): Promise<void>
    export declare function onMounted(hook: () => void): void
    export declare function onUnmounted(hook: () => void): void
    export declare function defineProps<T>(): T
    export declare function defineEmits<T>(): T & ((...args: any[]) => void)
    export declare function defineExpose<T>(exposed: T): void
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
