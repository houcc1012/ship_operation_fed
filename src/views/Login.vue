<template>
  <div class="login-container">
    <div class="login-main">
      <div class="login-card">
        <div class="logo-section">
          <img src="/src/assets/images/logo.png" alt="Logo" class="logo" />
          <h2>船舶作业管理系统</h2>
        </div>

        <LoginForm @login-success="handleLoginSuccess" />
      </div>
    </div>
    <a
      class="beian-link"
      href=" "
      rel="noreferrer"
      target="_blank"
    >
      <img
        class="beian-icon"
        src="https://www.beian.gov.cn/img/ghs.png"
        alt="公安备案图标"
      />
      浙公网安备33010502012646号
    </a>
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
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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

.beian-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: auto;
  padding: 10px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  text-decoration: none;
  align-self: center;
}

.beian-link:hover {
  text-decoration: underline;
}

.beian-icon {
  width: 16px;
  height: 16px;
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
