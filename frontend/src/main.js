import { createApp } from 'vue'
import App from './app/app vue/App.vue'
import router from './app/router'
import './style.css'

const app = createApp(App)
app.use(router).mount('#app')