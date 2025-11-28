<template>
  <el-form
    ref="loginFormRef"
    :model="form"
    :rules="rules"
    class="login-form"
    @submit.prevent="handleLogin"
  >
    <el-form-item prop="username">
      <el-input
        v-model="form.username"
        placeholder="用户名"
        size="large"
        clearable
        :prefix-icon="User"
        @keyup.enter="handleLogin"
      />
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="密码"
        size="large"
        clearable
        show-password
        :prefix-icon="Lock"
        @keyup.enter="handleLogin"
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
        {{ loading ? '登录中...' : '登录' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/userApi';
import { md5 } from 'js-md5';

const emit = defineEmits<{
  'login-success': []
  'login-error': [error: string]
}>()

const loginFormRef = ref<FormInstance>()
const userStore = useUserStore()

const form = reactive({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 50, message: '密码长度在 6 到 50 个字符', trigger: 'blur' }
  ]
}

const loading = ref(false)

const handleLogin = async () => {
  if (!loginFormRef.value) return
  const isValid = await loginFormRef.value.validate()
  if (!isValid) return
  loading.value = true
  const password = md5(form.password)

  login(form.username, password).then((res) => {
        console.log('success',res);
        userStore.processUserInfo(res);
        emit('login-success')
  }).catch((error) => {
    console.error('Login error:', error)
    emit('login-error', error.message || '登录失败')
  }).finally(() => {
    loading.value = false
  })
}

const resetForm = () => {
  if (loginFormRef.value) {
    loginFormRef.value.resetFields()
  }
}

// Expose methods for parent component
defineExpose({
  resetForm
})
</script>

<style scoped>
.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__content) {
  line-height: normal;
}

:deep(.el-input__inner) {
  height: 44px;
  line-height: 44px;
}

:deep(.el-input__prefix-inner) {
  height: 44px;
  display: flex;
  align-items: center;
}
</style>