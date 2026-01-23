<template>
  <div class="diary-view">
    <div class="diary-header">
      <h1 class="diary-title">📝 爪印日记</h1>
      <button
        @click="showCreateModal = true"
        class="create-btn"
        aria-label="创建新日记"
      >
        <span>+ 写日记</span>
      </button>
    </div>

    <!-- 统计信息 -->
    <div class="diary-stats" role="region" aria-label="日记统计">
      <div class="stat-card">
        <span class="stat-value">{{ diaryStore.entries.length }}</span>
        <span class="stat-label">总日记</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ diaryStore.streak }}</span>
        <span class="stat-label">连续天数</span>
      </div>
    </div>

    <!-- 日记列表 -->
    <div class="diary-list" role="feed" aria-label="日记列表">
      <article
        v-for="entry in diaryStore.recentEntries"
        :key="entry.id"
        class="diary-card"
      >
        <div
          class="diary-mood"
          :aria-label="`心情：${getMoodLabel(entry.mood)}`"
        >
          <span aria-hidden="true">{{ getMoodIcon(entry.mood) }}</span>
        </div>
        <div class="diary-content">
          <time class="diary-date" :datetime="entry.createdAt">{{ formatDate(entry.createdAt) }}</time>
          <p class="diary-text">{{ entry.content }}</p>
        </div>
      </article>

      <div
        v-if="diaryStore.entries.length === 0"
        class="empty-state"
        role="status"
        aria-live="polite"
      >
        <p>还没有日记，开始记录吧！</p>
      </div>
    </div>

    <!-- 创建日记弹窗 -->
    <div
      v-if="showCreateModal"
      class="modal-overlay"
      @click="closeModal"
      @keydown.esc="closeModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-diary-title"
    >
      <div class="modal-content" @click.stop role="document">
        <h2 id="create-diary-title" class="modal-title">记录心情</h2>

        <fieldset class="mood-selector">
          <legend class="mood-selector-legend">选择当前心情</legend>
          <div class="mood-buttons" role="group" aria-label="心情选项">
            <button
              v-for="mood in MOODS"
              :key="mood.id"
              @click="selectedMood = mood.id"
              class="mood-btn"
              :class="{ active: selectedMood === mood.id }"
              :aria-label="`选择${mood.name}心情`"
              :aria-pressed="selectedMood === mood.id"
            >
              <span class="mood-icon" aria-hidden="true">{{ mood.icon }}</span>
              <span class="mood-name">{{ mood.name }}</span>
            </button>
          </div>
        </fieldset>

        <label for="diary-content" class="visually-hidden">日记内容</label>
        <textarea
          id="diary-content"
          v-model="diaryContent"
          class="diary-textarea"
          placeholder="今天发生了什么？有什么感受？"
          rows="6"
          :aria-describedby="diaryContent ? '' : 'diary-help'"
        ></textarea>
        <span id="diary-help" class="visually-hidden">请输入你今天的日记内容</span>

        <div class="modal-actions">
          <button
            @click="closeModal"
            class="cancel-btn"
            aria-label="取消写日记"
          >
            取消
          </button>
          <button
            @click="saveDiary"
            class="save-btn"
            :disabled="!diaryContent.trim()"
            aria-label="保存日记"
          >
            保存
          </button>
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
import { ref, onMounted } from 'vue'
import TabBar from '@/views/Home/components/TabBar.vue'
import { useDiaryStore } from '@/stores/diary'
import { MOODS } from '@/data/moods'
import { useAchievementStore } from '@/stores/achievements'
import dayjs from 'dayjs'

const diaryStore = useDiaryStore()
const achievementStore = useAchievementStore()

const showCreateModal = ref(false)
const selectedMood = ref('happy')
const diaryContent = ref('')

const getMoodIcon = (moodId) => {
  const mood = MOODS.find(m => m.id === moodId)
  return mood?.icon || '😊'
}

const getMoodLabel = (moodId) => {
  const mood = MOODS.find(m => m.id === moodId)
  return mood?.name || '开心'
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm')
}

const closeModal = () => {
  showCreateModal.value = false
  selectedMood.value = 'happy'
  diaryContent.value = ''
}

const saveDiary = async () => {
  if (!diaryContent.value.trim()) {
    if (window.$toast) {
      window.$toast.warning('请输入日记内容', { title: '⚠️ 提示' })
    }
    return
  }

  try {
    await diaryStore.createEntry({
      content: diaryContent.value,
      mood: selectedMood.value
    })

    if (window.$toast) {
      window.$toast.success('日记保存成功！', {
        title: '✅ 保存成功',
        icon: '📝'
      })
    }
    closeModal()

    // 检查成就
    await achievementStore.checkAllAchievements()
  } catch (error) {
    if (window.$toast) {
      window.$toast.error('保存失败：' + error.message, {
        title: '❌ 保存失败'
      })
    }
  }
}

onMounted(async () => {
  await diaryStore.initDiary()
})
</script>

<style scoped>
/* 可访问性辅助类 */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.mood-selector-legend {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.diary-view {
  min-height: 100vh;
  padding: var(--space-lg);
  padding-bottom: 100px;
  background: var(--color-bg-primary);
}

.diary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.diary-title {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
}

.create-btn {
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.create-btn:hover {
  background: var(--color-primary-dark);
}

/* 统计卡片 */
.diary-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.stat-card {
  background: var(--color-bg-card);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.stat-value {
  display: block;
  font-size: var(--font-3xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-xs);
}

.stat-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

/* 日记列表 */
.diary-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.diary-card {
  background: var(--color-bg-card);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  display: flex;
  gap: var(--space-md);
  box-shadow: var(--shadow-md);
}

.diary-mood {
  font-size: var(--font-3xl);
}

.diary-content {
  flex: 1;
}

.diary-date {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
}

.diary-text {
  font-size: var(--font-md);
  color: var(--color-text-primary);
  line-height: 1.6;
}

.empty-state {
  text-align: center;
  padding: var(--space-3xl);
  color: var(--color-text-secondary);
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-md);
}

.modal-content {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-lg);
}

.mood-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: var(--color-bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.mood-btn:hover {
  border-color: var(--color-primary);
}

.mood-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.mood-icon {
  font-size: var(--font-2xl);
}

.mood-name {
  font-size: var(--font-xs);
}

.diary-textarea {
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-md);
  font-family: inherit;
  resize: vertical;
  margin-bottom: var(--space-lg);
}

.diary-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
}

.cancel-btn,
.save-btn {
  flex: 1;
  padding: var(--space-sm);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  cursor: pointer;
}

.cancel-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.save-btn {
  background: var(--color-primary);
  color: white;
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
