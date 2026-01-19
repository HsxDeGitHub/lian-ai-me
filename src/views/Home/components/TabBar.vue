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
.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: none;
  padding: var(--space-sm) 0;
  padding-bottom: max(var(--space-sm), env(safe-area-inset-bottom));
  box-shadow: 0 -4px 20px rgba(255, 182, 193, 0.15);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-xs) var(--space-sm);
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all var(--transition-bounce);
  min-width: 0;
  flex: 1;
  position: relative;
  border-radius: var(--radius-lg);
}

.tab-item:hover {
  color: var(--color-primary);
}

.tab-item:active {
  transform: scale(0.9);
}

.tab-item.active {
  color: var(--color-primary);
}

.tab-item.active::before {
  content: "";
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-cute-pink)
  );
  border-radius: var(--radius-full);
}

.tab-icon {
  font-size: 22px;
  transition: transform var(--transition-bounce);
}

.tab-item:active .tab-icon {
  animation: jelly 0.4s ease;
}

.tab-item.active .tab-icon {
  transform: scale(1.15);
}

.tab-label {
  font-size: 10px;
  font-weight: var(--font-semibold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.tab-item.active .tab-label {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-cute-pink)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Mobile safe area */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .tab-bar {
    padding-bottom: calc(var(--space-sm) + env(safe-area-inset-bottom));
  }
}
</style>
