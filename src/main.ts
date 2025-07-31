import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import NotificationPlugin from './plugins/notification'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(NotificationPlugin)
app.mount('#app')
