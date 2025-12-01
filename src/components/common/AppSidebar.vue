<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="/src/assets/images/logo.png" alt="Logo" class="logo" />
        <transition name="fade">
          <h1 v-show="!collapsed" class="app-title">船舶作业系统</h1>
        </transition>
      </div>
    </div>

    <nav class="sidebar-nav">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :unique-opened="true"
        :collapse-transition="false"
        background-color="#FFFFFF"
        text-color="#333333"
        active-text-color="#FFFFFF"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/job-management">
           <el-icon><Ship /></el-icon>
          <template #title>作业管理</template>
        </el-menu-item>

        <el-sub-menu index="user-management">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item style="margin-left: 20px;" index="/user-management/shipownerUserList">
            <!-- <el-icon><Ship /></el-icon> -->
            <template #title>船方/代理用户</template>
          </el-menu-item>
          <el-menu-item style="margin-left: 20px;" index="/user-management/supplierUserList">
            <!-- <el-icon><Tools /></el-icon> -->
            <template #title>作业方用户</template>
          </el-menu-item>
          <el-menu-item style="margin-left: 20px;" index="/user-management/adminUserList">
            <!-- <el-icon><UserFilled /></el-icon> -->
            <template #title>运营后台用户</template>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/supplier-management">
           <el-icon><Ship /></el-icon>
          <template #title>作业方管理</template>
        </el-menu-item>

        <el-sub-menu index="system-management">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item style="margin-left: 20px;" index="/system-management/data-dict">
            <!-- <el-icon><Tools /></el-icon> -->
            <template #title>数据字典</template>
          </el-menu-item>
          <el-menu-item style="margin-left: 20px;" index="/system-management/export-task-list">
            <!-- <el-icon><Document /></el-icon> -->
            <template #title>导出任务</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </nav>

    <!-- 用户信息区域 -->
    <div class="user-info-area">
      <div class="user-details">
        <div class="user-basic">
          <div class="user-avatar">
            <el-avatar size="small" :src="userStore.avatar || ''" :icon="UserFilled" style="cursor: pointer;">
              {{ userStore.userName ? userStore.userName.charAt(0) : '用' }}
            </el-avatar>
          </div>
          <div class="user-main-info">
            <div class="user-name">{{ userStore.userName|| '' }}</div>
            <div class="user-phone">{{ userStore.phone || '' }}</div>
          </div>
          <!-- <el-button type="primary" size="small" @click="showUpdatePwdDialog = true">修改密码</el-button> -->
          <el-icon @click="showUpdatePwdDialog = true"><Edit/></el-icon>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="showUpdatePwdDialog"
      title="修改密码"
      width="400px"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="pwdFormRef"
        :model="pwdForm"
        :rules="pwdFormRules"
        label-width="100px"
        autocomplete="off"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="pwdForm.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            maxlength="20"
            show-word-limit
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="pwdForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            maxlength="20"
            show-word-limit
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="pwdForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            maxlength="20"
            show-word-limit
            autocomplete="new-password"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDialog">取消</el-button>
          <el-button type="primary" @click="handleUpdatePassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { updatePwd } from '@/api/userApi'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  House,
  Ship,
  User,
  Setting,
  List,
  Plus,
  Tools,
  UserFilled,
  Document,
  Expand,
  Fold,
  Edit
} from '@element-plus/icons-vue'
import { md5 } from 'js-md5'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const activeMenu = computed(() => {
  return route.path
})

// 修改密码相关
const showUpdatePwdDialog = ref(false)
const pwdFormRef = ref()
const pwdForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码验证规则
const pwdFormRules = ref({
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === pwdForm.value.oldPassword) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

// 重置密码表单
const resetPwdForm = () => {
  pwdForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  if (pwdFormRef.value) {
    pwdFormRef.value.clearValidate()
  }
}

// 关闭弹窗
const handleCloseDialog = () => {
  resetPwdForm()
  showUpdatePwdDialog.value = false
}

// 修改密码
const handleUpdatePassword = async () => {
  if (!pwdFormRef.value) return
  
  try {
    await pwdFormRef.value.validate()
    
    // 加密密码
    const params = {
      oldPassword: md5(pwdForm.value.oldPassword),
      newPassword: md5(pwdForm.value.newPassword)
    }
    
    // 调用接口
    updatePwd(params).then((res: any) => {
      ElMessage.success('密码修改成功')
      showUpdatePwdDialog.value = false
      // 登出并跳转到登录页
      setTimeout(() => {
        userStore.logout()
        router.push('/login')
      }, 1500)
    })
  } catch (error) {
    console.error('密码修改失败:', error)
  }
}

// 获取用户信息
const loadUserInfo = async () => {
  try {
    await userStore.refreshUserInfo()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 组件挂载时获取用户信息
onMounted(() => {
  loadUserInfo()
})

// Watch for route changes to update active menu
watch(
  () => route.path,
  () => {
    // Active menu will be updated automatically via computed property
  },
  { immediate: true }
)
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 40px;
  border-radius: 6px;
}

.app-title {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu {
  border: none;
  height: 100%;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  padding-left: 20px !important;
}

.sidebar-menu :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  padding-left: 20px !important;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: #5180F4 !important;
}

/* 用户信息区域样式 */
.user-info-area {
  padding: 16px;
  border-top: 1px solid #f5f7fa;
  background: #ffffff;
}

.user-details {
  width: 100%;
}

.user-basic {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.user-main-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-phone {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-avatar {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

/* 侧边栏基础样式 */
.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: var(--ship-sidebar-width);
  background: #ffffff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.app-sidebar.collapsed {
  width: var(--ship-sidebar-collapsed-width);
}

.sidebar-header {
  height: var(--ship-header-height);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px;
  border-bottom: 1px solid #f5f7fa;
  background: #ffffff;
}

/* 取消菜单项 hover 的过渡，让响应更即时 */
.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  transition: none !important;
}

/* 如需自定义 hover 背景 */
.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa;
}

/* Fade transition for title */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>