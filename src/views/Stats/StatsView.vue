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

    <TabBar />
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
  padding-bottom: 100px;
  background: var(--color-bg-primary);
}

.stats-header {
  margin-bottom: var(--space-xl);
}

.stats-title {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.stat-card {
  background: var(--color-bg-card);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: var(--font-3xl);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
}

.stat-label {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
}

/* 心情分布 */
.mood-section {
  background: var(--color-bg-card);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.section-title {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-lg);
}

.mood-distribution {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.mood-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.mood-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mood-icon {
  font-size: var(--font-xl);
}

.mood-count {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

.mood-progress {
  width: 100%;
  height: 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.mood-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.empty-state {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
}
</style>
