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
          <el-menu-item style="margin-left: 20px;" index="/system-management/logs">
            <!-- <el-icon><Document /></el-icon> -->
            <template #title>操作日志</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </nav>

    <!-- <div class="sidebar-footer">
      <el-tooltip
        :content="collapsed ? '展开菜单' : '收起菜单'"
        placement="right"
      >
        <el-button
          type="text"
          :icon="collapsed ? Expand : Fold"
          @click="toggleCollapse"
          class="collapse-btn"
        />
      </el-tooltip>
    </div> -->
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
  Fold
} from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const router = useRouter()
const route = useRoute()

const collapsed = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const activeMenu = computed(() => {
  return route.path
})

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

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

.sidebar-footer {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #434a50;
  background: #263445;
}

.collapse-btn {
  color: #bfcbd9;
  font-size: 18px;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.collapse-btn:hover {
  color: white;
  background-color: #434a50;
}

/* 取消菜单项 hover 的过渡，让响应更即时 */
.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  transition: none !important;
}

/* 如需自定义 hover 背景，可恢复或设置为轻量色 */
.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  /* 示例：轻量 hover 背景，避免深色导致频繁重绘 */
  background-color: #f5f7fa;
}

/* 其余样式保持 */
.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: var(--ship-sidebar-width);
  background: #ffffff;
  z-index: 1000;
  /* transition: width var(--ship-transition-duration) var(--ship-transition-timing); */
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

.sidebar-menu {
  border: none;
  height: 100%;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  /* margin-left: 10px; */
  padding-left: 20px !important;
}

.sidebar-menu :deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
  padding-left: 20px !important;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: #5180F4 !important;
}


.sidebar-footer {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #434a50;
  background: #263445;
}

.collapse-btn {
  color: #bfcbd9;
  font-size: 18px;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.collapse-btn:hover {
  color: white;
  background-color: #434a50;
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