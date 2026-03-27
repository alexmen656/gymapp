import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//config
import config from './config/config.json'
import privacy_policy from './config/privacy-policy.html?raw'
import terms_of_use from './config/terms-of-use.html?raw'

//App.config.devtools = false
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide('config', config)
app.provide('privacy-policy', privacy_policy)
app.provide('terms-of-use', terms_of_use)
app.mount('#app')
