import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element-plus'
import { registerGuards } from './router/guards'

import '@/styles/variables.css'
import '@/styles/globals.css'

const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)
installElementPlus(app)

// Register ElementPlus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Register route guards
registerGuards()

app.mount('#app')