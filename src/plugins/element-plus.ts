import type { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/variables.css'
import '@/styles/globals.css'

export default function installElementPlus(app: App) {
  // Install ElementPlus
  app.use(ElementPlus)

  // Register all ElementPlus icons
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}