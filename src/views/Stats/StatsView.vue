<template>
  <div class="stats-view">
    <div class="stats-header">
      <h1 class="stats-title">📊 数据洞察</h1>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <span class="stat-value">{{ userStore.singleDays }}</span>
          <span class="stat-label">单身天数</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <span class="stat-value">{{ diaryStore.entries.length }}</span>
          <span class="stat-label">日记数量</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <span class="stat-value">{{ tasksStore.completedTasks.length }}</span>
          <span class="stat-label">完成任务</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-info">
          <span class="stat-value">{{ achievementStore.totalUnlocked }}</span>
          <span class="stat-label">解锁成就</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🦴</div>
        <div class="stat-info">
          <span class="stat-value">{{ currencyStore.totalEarned }}</span>
          <span class="stat-label">累计 earning</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🐕</div>
        <div class="stat-info">
          <span class="stat-value">{{ dogStore.interactionCount }}</span>
          <span class="stat-label">互动次数</span>
        </div>
      </div>
    </div>

    <!-- 心情分布 -->
    <div class="mood-section">
      <h2 class="section-title">心情分布</h2>
      <div class="mood-distribution">
        <div
          v-for="(count, mood) in diaryStore.moodDistribution"
          :key="mood"
          class="mood-bar"
        >
          <div class="mood-info">
            <span class="mood-icon">{{ getMoodIcon(mood) }}</span>
            <span class="mood-count">{{ count }}次</span>
          </div>
          <div class="mood-progress">
            <div
              class="mood-fill"
              :style="{
                width: (count / diaryStore.entries.length * 100) + '%',
                backgroundColor: getMoodColor(mood)
              }"
            ></div>
          </div>
        </div>
      </div>

      <div v-if="diaryStore.entries.length === 0" class="empty-state">
        <p>记录日记后查看心情分析</p>
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
import { useUserStore } from '@/stores/user'
import { useDiaryStore } from '@/stores/diary'
import { useTasksStore } from '@/stores/tasks'
import { useAchievementStore } from '@/stores/achievements'
import { useCurrencyStore } from '@/stores/currency'
import { useDogStore } from '@/stores/dog'
import { MOODS } from '@/data/moods'

const userStore = useUserStore()
const diaryStore = useDiaryStore()
const tasksStore = useTasksStore()
const achievementStore = useAchievementStore()
const currencyStore = useCurrencyStore()
const dogStore = useDogStore()

const getMoodIcon = (moodId) => {
  const mood = MOODS.find(m => m.id === moodId)
  return mood?.icon || '😊'
}

const getMoodColor = (moodId) => {
  const mood = MOODS.find(m => m.id === moodId)
  return mood?.color || '#FFD93D'
}

onMounted(async () => {
  await diaryStore.initDiary()
})
</script>

<style scoped>
.stats-view {
  min-height: 100vh;
  padding: var(--space-lg);
  padding-bottom: 120px;
  background: var(--gradient-modern-bg);
  max-width: 800px;
  margin: 0 auto;
}

.stats-header {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.stats-title {
  font-size: 28px;
  font-weight: 800;
  display: inline-block;
  background: var(--gradient-rainbow);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-md);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.stat-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  padding: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-glow);
  background: rgba(255, 255, 255, 0.85);
}

.stat-icon {
  font-size: 32px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Mood Section */
.mood-section {
  background: var(--glass-heavy-bg);
  backdrop-filter: var(--glass-heavy-backdrop);
  padding: 24px;
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 20px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: "";
  display: block;
  width: 4px;
  height: 18px;
  background: var(--color-primary);
  border-radius: 2px;
}

.mood-distribution {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mood-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mood-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mood-icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.mood-count {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.mood-progress {
  width: 100%;
  height: 10px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
}

.mood-fill {
  height: 100%;
  transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: var(--radius-full);
  position: relative;
}

.mood-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4), rgba(255,255,255,0.1));
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  border: 1px dashed rgba(0,0,0,0.1);
  font-size: 14px;
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
