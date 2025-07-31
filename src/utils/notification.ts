import type { NotificationItem } from '../components/NotificationToast.vue'

// 全局通知实例
let notificationInstance: any = null

// 设置通知实例
export const setNotificationInstance = (instance: any) => {
    notificationInstance = instance
}

// 通知选项接口
export interface NotificationOptions {
    message: string
    description?: string
    duration?: number // 毫秒，0表示不自动关闭
    type?: 'success' | 'error' | 'warning' | 'info'
}

// 基础通知方法
const notify = (options: NotificationOptions) => {
    if (!notificationInstance) {
        console.warn('Notification instance not found. Make sure NotificationToast component is mounted.')
        return
    }

    const defaultOptions: Required<NotificationOptions> = {
        message: '',
        description: '',
        duration: 4000,
        type: 'info'
    }

    const finalOptions = { ...defaultOptions, ...options }
    return notificationInstance.addNotification(finalOptions)
}

// 成功通知
export const notifySuccess = (message: string, description?: string, duration = 4000) => {
    return notify({
        type: 'success',
        message,
        description,
        duration
    })
}

// 错误通知
export const notifyError = (message: string, description?: string, duration = 6000) => {
    return notify({
        type: 'error',
        message,
        description,
        duration
    })
}

// 警告通知
export const notifyWarning = (message: string, description?: string, duration = 5000) => {
    return notify({
        type: 'warning',
        message,
        description,
        duration
    })
}

// 信息通知
export const notifyInfo = (message: string, description?: string, duration = 4000) => {
    return notify({
        type: 'info',
        message,
        description,
        duration
    })
}

// 替代原生alert的方法
export const alert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const notifyMap = {
        success: notifySuccess,
        error: notifyError,
        warning: notifyWarning,
        info: notifyInfo
    }

    return notifyMap[type](message)
}

// 清除所有通知
export const clearAllNotifications = () => {
    if (notificationInstance) {
        notificationInstance.clearAll()
    }
}

// 移除特定通知
export const removeNotification = (id: string) => {
    if (notificationInstance) {
        notificationInstance.removeNotification(id)
    }
}

// 默认导出，方便使用
export default {
    success: notifySuccess,
    error: notifyError,
    warning: notifyWarning,
    info: notifyInfo,
    alert,
    clear: clearAllNotifications,
    remove: removeNotification
}
