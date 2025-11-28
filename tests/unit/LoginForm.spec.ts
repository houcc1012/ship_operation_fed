import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import LoginForm from '@/components/business/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'

// Mock Element Plus message
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      error: vi.fn(),
      success: vi.fn()
    }
  }
})

// Mock auth store
vi.mock('@/stores/auth')

describe('LoginForm Component', () => {
  let mockAuthStore: any

  beforeEach(() => {
    mockAuthStore = {
      login: vi.fn(),
      loading: false
    }
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    vi.clearAllMocks()
  })

  const createWrapper = (props = {}) => {
    return mount(LoginForm, {
      props: {
        modelValue: true,
        ...props
      },
      global: {
        stubs: {
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-loading': true
        }
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render login form correctly', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="用户名"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('should show loading state when logging in', async () => {
      mockAuthStore.loading = true
      const wrapper = createWrapper()

      // Check if loading component is rendered
      const loadingElement = wrapper.find('.el-loading-mask')
      expect(loadingElement.exists()).toBe(true)
    })
  })

  describe('Form Validation', () => {
    it('should validate username is required', async () => {
      const wrapper = createWrapper()
      const form = wrapper.vm.form

      // Test empty username
      form.username = ''
      form.password = 'password123'

      const isValid = await wrapper.vm.validateForm()
      expect(isValid).toBe(false)
    })

    it('should validate password is required', async () => {
      const wrapper = createWrapper()
      const form = wrapper.vm.form

      // Test empty password
      form.username = 'testuser'
      form.password = ''

      const isValid = await wrapper.vm.validateForm()
      expect(isValid).toBe(false)
    })

    it('should validate valid form data', async () => {
      const wrapper = createWrapper()
      const form = wrapper.vm.form

      form.username = 'testuser'
      form.password = 'password123'

      const isValid = await wrapper.vm.validateForm()
      expect(isValid).toBe(true)
    })
  })

  describe('Login Functionality', () => {
    it('should call login with form data when form is valid', async () => {
      const wrapper = createWrapper()
      const form = wrapper.vm.form

      form.username = 'testuser'
      form.password = 'password123'

      // Mock successful validation
      vi.spyOn(wrapper.vm, 'validateForm').mockResolvedValue(true)

      await wrapper.vm.handleLogin()

      expect(mockAuthStore.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      })
    })

    it('should not call login when form is invalid', async () => {
      const wrapper = createWrapper()

      // Mock failed validation
      vi.spyOn(wrapper.vm, 'validateForm').mockResolvedValue(false)

      await wrapper.vm.handleLogin()

      expect(mockAuthStore.login).not.toHaveBeenCalled()
    })

    it('should handle successful login', async () => {
      mockAuthStore.login.mockResolvedValue({ success: true })

      const wrapper = createWrapper()
      const form = wrapper.vm.form

      form.username = 'testuser'
      form.password = 'password123'

      vi.spyOn(wrapper.vm, 'validateForm').mockResolvedValue(true)

      await wrapper.vm.handleLogin()

      expect(ElMessage.success).toHaveBeenCalledWith('登录成功')
      expect(wrapper.emitted('login-success')).toBeTruthy()
    })

    it('should handle failed login', async () => {
      mockAuthStore.login.mockResolvedValue({ success: false, error: 'Invalid credentials' })

      const wrapper = createWrapper()
      const form = wrapper.vm.form

      form.username = 'testuser'
      form.password = 'wrongpassword'

      vi.spyOn(wrapper.vm, 'validateForm').mockResolvedValue(true)

      await wrapper.vm.handleLogin()

      expect(ElMessage.error).toHaveBeenCalledWith('登录失败，请检查用户名和密码')
    })

    it('should handle login errors', async () => {
      mockAuthStore.login.mockRejectedValue(new Error('Network error'))

      const wrapper = createWrapper()
      const form = wrapper.vm.form

      form.username = 'testuser'
      form.password = 'password123'

      vi.spyOn(wrapper.vm, 'validateForm').mockResolvedValue(true)

      await wrapper.vm.handleLogin()

      expect(ElMessage.error).toHaveBeenCalledWith('登录失败')
    })
  })

  describe('Reset Form', () => {
    it('should reset form data', () => {
      const wrapper = createWrapper()
      const form = wrapper.vm.form

      // Set some data
      form.username = 'testuser'
      form.password = 'password123'

      wrapper.vm.resetForm()

      expect(form.username).toBe('')
      expect(form.password).toBe('')
    })
  })

  describe('Keyboard Events', () => {
    it('should handle Enter key press in password field', async () => {
      const wrapper = createWrapper()
      const loginSpy = vi.spyOn(wrapper.vm, 'handleLogin')

      // Simulate Enter key press
      const passwordField = wrapper.find('input[type="password"]')
      await passwordField.trigger('keydown.enter')

      expect(loginSpy).toHaveBeenCalled()
    })
  })
})