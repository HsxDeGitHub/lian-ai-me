<template>
  <div class="profile-view">
    <div class="profile-header">
      <div class="avatar-section">
        <div class="avatar">{{ dogStore.dogInfo?.emoji || '🐕' }}</div>
        <div class="user-info">
          <h2 class="user-name">{{ userStore.nickname }}</h2>
          <p class="user-status">{{ userStore.statusText }}</p>
        </div>
      </div>
    </div>

    <!-- 个人统计 -->
    <div class="profile-stats">
      <div class="profile-stat-item">
        <span class="stat-value">{{ userStore.singleDays }}天</span>
        <span class="stat-label">单身时长</span>
      </div>
      <div class="profile-stat-item">
        <span class="stat-value">{{ dogStore.interactionCount }}</span>
        <span class="stat-label">互动次数</span>
      </div>
      <div class="profile-stat-item">
        <span class="stat-value">{{ achievementStore.totalUnlocked }}</span>
        <span class="stat-label">成就解锁</span>
      </div>
    </div>

    <!-- 设置选项 -->
    <div class="settings-section">
      <h3 class="section-title">设置</h3>

      <div class="setting-item">
        <span class="setting-label">情感状态</span>
        <select v-model="userStore.status" @change="updateStatus" class="setting-select">
          <option value="enjoying">享受单身</option>
          <option value="seeking">积极寻找</option>
          <option value="chill">随缘佛系</option>
          <option value="taken">心有所属</option>
        </select>
      </div>

      <div class="setting-item">
        <span class="setting-label">通知</span>
        <label class="toggle-switch">
          <input
            type="checkbox"
            v-model="userStore.settings.notifications"
            @change="updateSettings"
          />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-item">
        <span class="setting-label">音效</span>
        <label class="toggle-switch">
          <input
            type="checkbox"
            v-model="userStore.settings.soundEnabled"
            @change="updateSettings"
          />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <!-- 成就展示 -->
    <div class="achievements-section">
      <h3 class="section-title">成就收藏</h3>
      <div class="achievements-grid">
        <div
          v-for="achievement in achievementStore.unlocked"
          :key="achievement.id"
          class="achievement-item"
          :class="`quality-${achievement.rarity}`"
        >
          <span class="achievement-icon">{{ achievement.icon }}</span>
          <span class="achievement-name">{{ achievement.title }}</span>
        </div>

        <div v-if="achievementStore.unlocked.length === 0" class="empty-state">
          <p>还没有解锁成就</p>
        </div>
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
import { useDogStore } from '@/stores/dog'
import { useAchievementStore } from '@/stores/achievements'

const userStore = useUserStore()
const dogStore = useDogStore()
const achievementStore = useAchievementStore()

const updateStatus = () => {
  userStore.setStatus(userStore.status)
}

const updateSettings = () => {
  userStore.updateSettings(userStore.settings)
}

onMounted(async () => {
  await dogStore.initDog()
  await achievementStore.initAchievements()
})
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  padding: var(--space-lg);
  padding-bottom: 100px;
  background: var(--color-bg-primary);
}

.profile-header {
  background: var(--color-bg-card);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-md);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.avatar {
  width: 80px;
  height: 80px;
  font-size: var(--font-4xl);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
}

.user-status {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

/* 统计 */
.profile-stats {
  display: flex;
  justify-content: space-around;
  background: var(--color-bg-card);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-md);
}

.profile-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.profile-stat-item .stat-value {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
}

.profile-stat-item .stat-label {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
}

/* 设置 */
.settings-section,
.achievements-section {
  background: var(--color-bg-card);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-md);
}

.section-title {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-lg);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: var(--font-md);
  color: var(--color-text-primary);
}

.setting-select {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-md);
  background: var(--color-bg-primary);
}

/* 开关 */
.toggle-switch {
  position: relative;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border);
  transition: 0.3s;
  border-radius: var(--radius-full);
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* 成就 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-sm);
}

.achievement-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 2px solid transparent;
}

.achievement-item.quality-common {
  border-color: var(--quality-common);
}

.achievement-item.quality-rare {
  border-color: var(--quality-rare);
}

.achievement-item.quality-epic {
  border-color: var(--quality-epic);
}

.achievement-item.quality-legendary {
  border-color: var(--quality-legendary);
}

.achievement-icon {
  font-size: var(--font-3xl);
}

.achievement-name {
  font-size: var(--font-xs);
  text-align: center;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
}

/* 固定底部导航栏 */
.tab-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
}
</style>
