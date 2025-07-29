import { createPinia } from 'pinia'

import { createApp } from 'vue'
import Toast from 'vue-toastification'

import App from './App.vue'
import router from './router'
import 'flyonui/dist/tooltip'
import 'flyonui/dist/dropdown'
import 'flyonui/dist/overlay'
import './style.css'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast)

app.mount('#app')
