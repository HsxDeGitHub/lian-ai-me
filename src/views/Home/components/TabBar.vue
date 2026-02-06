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
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tabs = [
  { path: "/", icon: "🏠", label: "小窝" },
  { path: "/shop", icon: "🛒", label: "商店" },
  { path: "/tasks", icon: "⭐", label: "任务" },
  { path: "/diary", icon: "📝", label: "日记" },
  { path: "/community", icon: "🌳", label: "社区" },
  { path: "/stats", icon: "📊", label: "统计" },
  { path: "/profile", icon: "👤", label: "我的" },
];

const isActive = (path) => {
  return route.path === path;
};
</script>

<style scoped>
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .tab-bar {
    margin-bottom: calc(var(--space-md) + env(safe-area-inset-bottom));
  }
}

.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--glass-heavy-bg);
  backdrop-filter: var(--glass-heavy-backdrop);
  -webkit-backdrop-filter: var(--glass-heavy-backdrop);
  border: var(--glass-border);
  padding: 10px;
  box-shadow: var(--shadow-glass), var(--shadow-cute);
  border-radius: var(--radius-full);
  margin: 0 var(--space-md) var(--space-md);
  transition: all var(--transition-base);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all var(--transition-bounce);
  min-width: 0;
  flex: 1;
  position: relative;
  border-radius: var(--radius-full);
  height: 100%;
}

.tab-item:hover {
  color: var(--color-primary);
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.tab-item:active {
  transform: scale(0.9);
}

.tab-item.active {
  color: var(--color-primary-dark);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: var(--shadow-sm);
}

.tab-item.active::before {
  display: none; /* Remove old indicator */
}

/* New active dot indicator */
.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--color-primary);
}

.tab-icon {
  font-size: 22px;
  transition: transform var(--transition-bounce);
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.05));
}

.tab-item:active .tab-icon {
  animation: jelly 0.4s ease;
}

.tab-item.active .tab-icon {
  transform: scale(1.1) translateY(-2px);
  filter: drop-shadow(0 4px 6px rgba(255, 140, 148, 0.4));
}

.tab-label {
  font-size: 10px;
  font-weight: var(--font-bold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin-top: 2px;
  opacity: 0.8;
}

.tab-item.active .tab-label {
  color: var(--color-primary-dark);
  opacity: 1;
}
</style>
