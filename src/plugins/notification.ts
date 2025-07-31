import type { App } from 'vue'
import notification from '../utils/notification'

// 声明全局属性类型
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $notify: typeof notification
        $alert: typeof notification.alert
    }
}

export default {
    install(app: App) {
        // 添加全局属性
        app.config.globalProperties.$notify = notification
        app.config.globalProperties.$alert = notification.alert

        // 提供注入
        app.provide('notification', notification)
    }
}
