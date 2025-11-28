import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/utils/request'
import type { User, UserSession } from '@/types/auth'

// Mock the API module
vi.mock('@/utils/request', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      const store = useAuthStore()

      expect(store.user).toBe(null)
      expect(store.token).toBe(null)
      expect(store.isAuthenticated).toBe(false)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should restore state from localStorage if available', () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        realName: 'Test User',
        userType: 'ADMIN',
        permissions: []
      }
      const mockToken = 'mock-token'

      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))

      const store = useAuthStore()

      expect(store.token).toBe(mockToken)
      expect(store.user).toEqual(mockUser)
    })
  })

  describe('Login', () => {
    const mockCredentials = {
      username: 'testuser',
      password: 'password123'
    }

    const mockLoginResponse = {
      success: true,
      data: {
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          username: 'testuser',
          realName: 'Test User',
          userType: 'ADMIN',
          permissions: [
            { id: '1', name: 'Admin Access', code: 'ADMIN_ACCESS', resource: '*', action: '*' }
          ]
        },
        expiresIn: 3600
      }
    }

    it('should login successfully with valid credentials', async () => {
      vi.mocked(api.post).mockResolvedValue(mockLoginResponse)

      const store = useAuthStore()
      const result = await store.login(mockCredentials)

      expect(result.success).toBe(true)
      expect(store.user).toEqual(mockLoginResponse.data.user)
      expect(store.token).toBe(mockLoginResponse.data.token)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBe(null)
      expect(localStorage.getItem('token')).toBe(mockLoginResponse.data.token)
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockLoginResponse.data.user))
    })

    it('should handle login failure with invalid credentials', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Invalid credentials'))

      const store = useAuthStore()
      const result = await store.login(mockCredentials)

      expect(result.success).toBe(false)
      expect(store.user).toBe(null)
      expect(store.token).toBe(null)
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).not.toBe(null)
    })

    it('should set loading state during login', async () => {
      vi.mocked(api.post).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockLoginResponse), 100)))

      const store = useAuthStore()
      const loginPromise = store.login(mockCredentials)

      expect(store.loading).toBe(true)

      await loginPromise

      expect(store.loading).toBe(false)
    })
  })

  describe('Logout', () => {
    it('should logout and clear user data', async () => {
      // Setup logged in state
      const store = useAuthStore()
      store.user = { id: '1', username: 'test', realName: 'Test', userType: 'ADMIN', permissions: [] }
      store.token = 'mock-token'
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify({ id: '1', username: 'test', realName: 'Test', userType: 'ADMIN', permissions: [] }))

      vi.mocked(api.post).mockResolvedValue({ success: true })

      await store.logout()

      expect(store.user).toBe(null)
      expect(store.token).toBe(null)
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('token')).toBe(null)
      expect(localStorage.getItem('user')).toBe(null)
    })

    it('should handle logout API errors gracefully', async () => {
      const store = useAuthStore()
      store.user = { id: '1', username: 'test', realName: 'Test', userType: 'ADMIN', permissions: [] }
      store.token = 'mock-token'
      localStorage.setItem('token', 'mock-token')

      vi.mocked(api.post).mockRejectedValue(new Error('Network error'))

      await store.logout()

      // Should still clear local data even if API call fails
      expect(store.user).toBe(null)
      expect(store.token).toBe(null)
      expect(localStorage.getItem('token')).toBe(null)
    })
  })

  describe('Token Expiration', () => {
    it('should detect expired token', () => {
      const store = useAuthStore()
      const expiredToken = 'expired-token'

      store.token = expiredToken

      // Mock JWT decode to return expired token
      vi.spyOn(store, 'isTokenExpired').mockReturnValue(true)

      expect(store.isTokenExpired()).toBe(true)
    })

    it('should detect valid token', () => {
      const store = useAuthStore()

      // Mock JWT decode to return valid token
      vi.spyOn(store, 'isTokenExpired').mockReturnValue(false)

      expect(store.isTokenExpired()).toBe(false)
    })
  })
})