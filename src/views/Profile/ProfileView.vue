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
  padding-bottom: 120px;
  background: var(--gradient-modern-bg);
  max-width: 800px;
  margin: 0 auto;
}

/* Header */
.profile-header {
  background: var(--glass-heavy-bg);
  backdrop-filter: var(--glass-heavy-backdrop);
  padding: var(--space-xl);
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-lg);
  border: var(--glass-border);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.profile-header:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.profile-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--gradient-primary);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  position: relative;
  z-index: 1;
}

.avatar {
  width: 88px;
  height: 88px;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 30%, #ffffff, #fff0f5);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-cute);
  border: 4px solid rgba(255, 255, 255, 0.8);
  animation: float-avatar 4s ease-in-out infinite;
}

@keyframes float-avatar {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: var(--font-2xl);
  font-weight: 800;
  margin-bottom: 4px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-status {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.5);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  display: inline-block;
}

/* Stats */
.profile-stats {
  display: flex;
  justify-content: space-around;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  padding: var(--space-lg);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
}

.profile-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: transform 0.2s ease;
  cursor: default;
}

.profile-stat-item:hover {
  transform: scale(1.05);
}

.profile-stat-item .stat-value {
  font-size: var(--font-xl);
  font-weight: 800;
  color: var(--color-primary-dark);
  text-shadow: 2px 2px 0 rgba(255, 140, 148, 0.1);
}

.profile-stat-item .stat-label {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Settings & Achievements Sections */
.settings-section,
.achievements-section {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
}

.section-title {
  font-size: var(--font-lg);
  font-weight: 800;
  margin-bottom: var(--space-lg);
  padding-left: 12px;
  border-left: 4px solid var(--color-primary);
  color: var(--color-text-primary);
}

/* Settings Items */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: var(--font-md);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.setting-select {
  padding: 8px 16px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  background: rgba(255, 255, 255, 0.8);
  color: var(--color-text-primary);
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
}

.setting-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 140, 148, 0.2);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: 50px;
  height: 28px;
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
  background-color: #e2e8f0;
  transition: .4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

input:checked + .toggle-slider {
  background: var(--gradient-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(22px);
}

/* Achievements Grid */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-md);
}

.achievement-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255,255,255,0.6);
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.achievement-item:hover {
  transform: translateY(-4px);
  background: white;
  box-shadow: var(--shadow-md);
}

.achievement-item.quality-common { border-color: rgba(189, 195, 199, 0.3); }
.achievement-item.quality-rare { border-color: rgba(129, 212, 250, 0.5); }
.achievement-item.quality-epic { border-color: rgba(206, 147, 216, 0.5); }
.achievement-item.quality-legendary { 
  border-color: rgba(255, 213, 79, 0.6);
  box-shadow: 0 0 15px rgba(255, 213, 79, 0.2);
}

.achievement-icon {
  font-size: 32px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.achievement-name {
  font-size: 11px;
  font-weight: var(--font-bold);
  text-align: center;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
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
