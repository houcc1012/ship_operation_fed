<template>
  <div class="app-layout">
    <AppSidebar v-model:collapsed="sidebarCollapsed" />
    <div class="main-content">
      <!-- <AppHeader @toggle-sidebar="toggleSidebar" /> -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0;
  transition: margin-left var(--ship-transition-duration) var(--ship-transition-timing);
}

.content-area {
  flex: 1;
  padding: var(--ship-content-padding);
  overflow-y: auto;
  background-color: #F9FAFB;
}

/* Sidebar states */
@media (min-width: 768px) {
  .main-content {
    margin-left: var(--ship-sidebar-width);
  }

  .main-content.sidebar-collapsed {
    margin-left: var(--ship-sidebar-collapsed-width);
  }
}

@media (max-width: 767px) {
  .app-layout {
    position: relative;
  }

  .main-content {
    margin-left: 0;
  }
}
</style>