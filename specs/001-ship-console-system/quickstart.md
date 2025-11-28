# Quickstart Guide: Ship Operation Console System

**Date**: 2025-11-18
**Target Audience**: Developers implementing the frontend system

## Prerequisites

### Development Environment
- Node.js 18+
- npm or yarn package manager
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- Git for version control

### Required Dependencies
- Vue 3.3+
- TypeScript 5.0+
- Element Plus 3.0+
- Vite 4.0+
- Pinia (state management)
- Vue Router 4+
- Vitest (testing)
- Axios (HTTP client)

## Project Setup

### 1. Create New Vue3 Project
```bash
# Using create-vue
npm create vue@latest ship-operation-console
cd ship-operation-console

# Select options:
# ✅ TypeScript
# ✅ Router
# ✅ Pinia
# ✅ Vitest
# ✅ ESLint
# ✅ Prettier
```

### 2. Install Dependencies
```bash
npm install
npm install element-plus @element-plus/icons-vue
npm install axios
npm install @types/node --save-dev
```

### 3. Configure ElementPlus
Create `src/plugins/element-plus.ts`:
```typescript
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type { App } from 'vue'

export default function installElementPlus(app: App) {
  app.use(ElementPlus)

  // Register all icons
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
```

### 4. Configure Axios
Create `src/utils/request.ts`:
```typescript
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for auth token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
```

### 5. Setup Pinia Stores

#### Auth Store (`src/stores/auth.ts`):
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/utils/request'
import type { User, UserSession } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await request.post('/auth/login', credentials)
      const { token: newToken, user: userData } = response.data

      token.value = newToken
      user.value = userData
      localStorage.setItem('token', newToken)

      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const logout = async () => {
    try {
      await request.post('/auth/logout')
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
})
```

#### Menu Store (`src/stores/menu.ts`):
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import type { MenuItem } from '@/types/menu'

export const useMenuStore = defineStore('menu', () => {
  const menuItems = ref<MenuItem[]>([])
  const loading = ref(false)

  const fetchMenu = async () => {
    loading.value = true
    try {
      const response = await request.get('/menus')
      menuItems.value = response.data
    } finally {
      loading.value = false
    }
  }

  return {
    menuItems,
    loading,
    fetchMenu
  }
})
```

### 6. Configure Router
Create `src/router/index.ts`:
```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'MainDashboard',
          component: () => import('@/components/business/DashboardContent.vue')
        },
        {
          path: 'job-management',
          name: 'JobManagement',
          component: () => import('@/views/JobManagement.vue')
        },
        {
          path: 'user-management',
          name: 'UserManagement',
          component: () => import('@/views/UserManagement.vue')
        },
        {
          path: 'system-management',
          name: 'SystemManagement',
          component: () => import('@/views/SystemManagement.vue')
        }
      ]
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
```

### 7. Create Layout Components

#### App Layout (`src/components/common/AppLayout.vue`):
```vue
<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-content">
      <AppHeader />
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
```

### 8. Create Core Pages

#### Login Page (`src/views/Login.vue`):
```vue
<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <img src="/src/assets/images/logo.png" alt="Logo" />
        <h2>船舶作业管理系统</h2>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    const result = await authStore.login(loginForm)

    if (result.success) {
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error('登录失败，请检查用户名和密码')
    }
  } catch (error) {
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-section img {
  height: 60px;
  margin-bottom: 10px;
}

.logo-section h2 {
  color: #333;
  margin: 0;
  font-size: 24px;
}

.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
}
</style>
```

## Development Commands

### Start Development Server
```bash
npm run dev
```

### Run Tests
```bash
npm run test
```

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npm run type-check
```

## Environment Variables

Create `.env.development`:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## Testing

### Unit Test Example
```typescript
// tests/unit/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty state', () => {
    const store = useAuthStore()
    expect(store.user).toBe(null)
    expect(store.token).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })
})
```

## Next Steps

1. **Implement remaining components**: Complete the sidebar, header, and business components
2. **Add API integration**: Connect to actual backend APIs
3. **Implement error handling**: Add comprehensive error handling and loading states
4. **Add accessibility features**: Implement ARIA labels and keyboard navigation
5. **Performance optimization**: Add lazy loading and code splitting
6. **E2E testing**: Add Cypress tests for critical user journeys
7. **Deployment**: Configure build and deployment pipeline

## Common Issues

### CORS Issues
Configure backend to allow requests from your frontend domain or use proxy in Vite config.

### Authentication Flow
Ensure token storage and refresh logic is properly implemented to handle token expiration.

### Responsive Design
Test on mobile devices and adjust breakpoints as needed using ElementPlus grid system.