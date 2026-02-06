<template>
  <div class="tasks-view">
    <div class="tasks-header">
      <h1 class="tasks-title">⭐ 光荣之爪</h1>
      <div class="progress-info">
        <span class="progress-text">今日进度: {{ tasksStore.todayProgress }}%</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: tasksStore.todayProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="tasks-list">
      <div
        v-for="task in tasksStore.activeTasks"
        :key="task.id"
        class="task-card"
        :class="{ completed: task.completed }"
      >
        <div class="task-icon">{{ task.icon }}</div>
        <div class="task-info">
          <h3 class="task-title">{{ task.title }}</h3>
          <p class="task-description">{{ task.description }}</p>
          <div class="task-reward">
            <span class="reward-icon">🦴</span>
            <span class="reward-amount">+{{ task.reward }}</span>
          </div>
        </div>
        <button
          @click="completeTask(task)"
          class="complete-btn"
          :disabled="task.completed"
        >
          {{ task.completed ? '✓ 完成' : '完成' }}
        </button>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="tab-bar-wrapper">
      <TabBar />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TabBar from '@/views/Home/components/TabBar.vue'
import { useTasksStore } from '@/stores/tasks'
import { useAchievementStore } from '@/stores/achievements'

const tasksStore = useTasksStore()
const achievementStore = useAchievementStore()

const completeTask = async (task) => {
  try {
    await tasksStore.completeTask(task.id)
    if (window.$toast) {
      window.$toast.success(`任务完成！获得 ${task.reward} 骨头币`, {
        title: '🎉 完成任务',
        icon: '⭐'
      })
    }
    // 检查成就
    await achievementStore.checkAllAchievements()
  } catch (error) {
    if (window.$toast) {
      window.$toast.error(error.message, {
        title: '❌ 操作失败'
      })
    }
  }
}

onMounted(async () => {
  await tasksStore.initTasks()
})
</script>

<style scoped>
.tasks-view {
  min-height: 100vh;
  padding: var(--space-lg);
  padding-bottom: 120px;
  background: var(--gradient-modern-bg);
  max-width: 800px;
  margin: 0 auto;
}

.tasks-header {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.tasks-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: var(--space-lg);
  background: var(--gradient-rainbow);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.progress-info {
  background: var(--glass-heavy-bg);
  backdrop-filter: var(--glass-heavy-backdrop);
  padding: 20px;
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
  transition: transform 0.3s ease;
}

.progress-info:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.progress-text {
  font-size: var(--font-sm);
  color: var(--color-text-primary);
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: var(--font-bold);
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.progress-fill {
  height: 100%;
  background: var(--gradient-secondary);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--radius-full);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.4) 50%,
    rgba(255,255,255,0) 100%
  );
  transform: skewX(-20deg) translateX(-150%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% { transform: skewX(-20deg) translateX(150%); }
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.task-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08); /* Custom soft shadow */
  background: rgba(255, 255, 255, 0.85);
}

.task-card.completed {
  opacity: 0.7;
  background: rgba(255, 255, 255, 0.4);
}

.task-icon {
  font-size: 36px;
  background: white;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  box-shadow: var(--shadow-xs);
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: var(--font-md);
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--color-text-primary);
}

.task-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.task-reward {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 140, 148, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
}

.reward-icon {
  font-size: 14px;
}

.reward-amount {
  font-size: 12px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.complete-btn {
  padding: 8px 16px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(255, 140, 148, 0.3);
  white-space: nowrap;
}

.complete-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 140, 148, 0.4);
}

.complete-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.complete-btn:disabled {
  background: #e0e0e0;
  color: #a0a0a0;
  box-shadow: none;
  cursor: default;
}

/* Tab Bar Wrapper */
.tab-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  pointer-events: none;
}
.tab-bar-wrapper > * { pointer-events: auto; }
</style>
