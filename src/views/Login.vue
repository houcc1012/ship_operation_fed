<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <img src="/src/assets/images/logo.png" alt="Logo" class="logo" />
        <h2>船舶作业管理系统</h2>
      </div>

      <LoginForm @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginForm from '@/components/business/LoginForm.vue'

const router = useRouter()

const handleLoginSuccess = () => {
  router.push('/job-management')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  height: 60px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.logo-section h2 {
  color: #333;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .logo-section h2 {
    font-size: 20px;
  }
}
</style>