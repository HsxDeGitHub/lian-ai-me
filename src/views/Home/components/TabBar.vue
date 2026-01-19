<template>
  <nav class="tab-bar">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tab-item"
      :class="{ active: isActive(tab.path) }"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { path: '/', icon: '🏠', label: '小窝' },
  { path: '/shop', icon: '🛒', label: '商店' },
  { path: '/tasks', icon: '⭐', label: '任务' },
  { path: '/diary', icon: '📝', label: '日记' },
  { path: '/community', icon: '🌳', label: '社区' },
  { path: '/stats', icon: '📊', label: '统计' },
  { path: '/profile', icon: '👤', label: '我的' }
]

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border);
  padding: var(--space-sm) 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs);
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  min-width: 0;
  flex: 1;
}

.tab-item:hover {
  color: var(--color-primary);
}

.tab-item.active {
  color: var(--color-primary);
}

.tab-icon {
  font-size: var(--font-xl);
}

.tab-label {
  font-size: var(--font-xs);
  font-weight: var(--font-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
