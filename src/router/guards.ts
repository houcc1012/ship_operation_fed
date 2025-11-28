import type { RouteLocationNormalized } from 'vue-router'
import router from '@/router'
import { useUserStore } from '@/stores/user'

// Authentication guard
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: Function
) => {
  const authStore = useUserStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth !== false) {
    // Route requires authentication
    if (authStore.isLoggedIn) {
      next(); // 用户已登录，继续导航
    } else {
      // 用户未登录，跳转到登录页面
      next({ path: "/login", query: { redirect: to.fullPath } });
    }
  }else{
    // Route does not require authentication
    next(); // 继续导航
  }
}

// Permission guard for role-based access control
// Page title guard
export const titleGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: Function
) => {
  const baseTitle = import.meta.env.VITE_APP_TITLE || '船舶作业管理系统'
  document.title = to.meta.title
    ? `${to.meta.title} - ${baseTitle}`
    : baseTitle

  next()
}

// Register all guards
export function registerGuards() {
  router.beforeEach(authGuard)
  router.beforeEach(titleGuard)

  // Error handler for navigation
  router.onError((error) => {
    console.error('Router error:', error)
    // You might want to show an error message or redirect to an error page
  })
}