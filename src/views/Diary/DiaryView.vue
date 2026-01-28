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
        <div class="modal-header">
          <h2 id="create-diary-title" class="modal-title">✨ 记录心情</h2>
          <button class="close-icon-btn" @click="closeModal" aria-label="关闭">✕</button>
        </div>

        <fieldset class="mood-selector">
          <legend class="mood-selector-legend">今天的心情是...</legend>
          <div class="mood-scroller" role="group" aria-label="心情选项">
            <button
              v-for="mood in MOODS"
              :key="mood.id"
              @click="selectedMood = mood.id"
              class="mood-btn"
              :class="{ active: selectedMood === mood.id }"
              :aria-label="`选择${mood.name}心情`"
              :aria-pressed="selectedMood === mood.id"
            >
              <div class="mood-icon-wrapper">
                <span class="mood-icon" aria-hidden="true">{{ mood.icon }}</span>
              </div>
              <span class="mood-name">{{ mood.name }}</span>
            </button>
          </div>
        </fieldset>

        <div class="diary-input-area">
          <label for="diary-content" class="visually-hidden">日记内容</label>
          <textarea
            id="diary-content"
            v-model="diaryContent"
            class="diary-textarea"
            placeholder="今天发生了什么有趣的、难忘的事情？写下来吧..."
            rows="6"
            :aria-describedby="diaryContent ? '' : 'diary-help'"
          ></textarea>
          <span id="diary-help" class="visually-hidden">请输入你今天的日记内容</span>
        </div>

        <div class="modal-actions">
          <button
            @click="saveDiary"
            class="save-btn"
            :disabled="!diaryContent.trim() || isSaving"
            aria-label="保存日记"
          >
            {{ isSaving ? '保存中...' : '保存日记' }}
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

const isSaving = ref(false)

const closeModal = () => {
  showCreateModal.value = false
  setTimeout(() => {
    // Reset after animation
    selectedMood.value = 'happy'
    diaryContent.value = ''
    isSaving.value = false
  }, 300)
}

const saveDiary = async () => {
  if (!diaryContent.value.trim()) {
    if (window.$toast) {
      window.$toast.warning('请输入日记内容', { title: '⚠️ 提示' })
    }
    return
  }

  isSaving.value = true
  
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
    
    // Explicitly close modal on success
    closeModal()

    // 检查成就 (non-blocking for UI close)
    achievementStore.checkAllAchievements().catch(err => {
      console.warn('Achievement check failed:', err)
    })
    
  } catch (error) {
    console.error('Save diary error:', error)
    if (window.$toast) {
      window.$toast.error('保存失败：' + error.message, {
        title: '❌ 保存失败'
      })
    } else {
      alert('保存失败：' + error.message)
    }
    isSaving.value = false
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
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
  font-weight: var(--font-medium);
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
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.create-btn {
  padding: var(--space-sm) var(--space-lg);
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.create-btn:active {
  transform: translateY(0);
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
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
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
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: transform var(--transition-base);
}

.diary-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.diary-mood {
  font-size: var(--font-3xl);
  display: flex;
  align-items: flex-start;
  padding-top: var(--space-xs);
}

.diary-content {
  flex: 1;
}

.diary-date {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
  display: block;
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
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  margin-top: var(--space-xl);
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-md);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.modal-title {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.close-icon-btn {
  background: none;
  border: none;
  font-size: var(--font-lg);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
}

.mood-selector {
  border: none;
  padding: 0;
  margin: 0 0 var(--space-lg) 0;
}

/* 优化后的心情选择器 */
.mood-scroller {
  display: flex;
  flex-wrap: wrap; /* 改为换行布局 */
  justify-content: center; /* 居中对齐 */
  gap: var(--space-md);
  padding: var(--space-xs);
}

.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  background: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  width: 60px; /* 固定宽度 */
}

.mood-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  border-radius: 50%; /* 圆形 */
  border: 2px solid transparent;
  transition: all var(--transition-base);
}

.mood-btn:hover .mood-icon-wrapper {
  transform: scale(1.1);
  background: white;
}

.mood-btn.active .mood-icon-wrapper {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  transform: scale(1.1);
  box-shadow: var(--shadow-cute);
}

.mood-icon {
  font-size: 28px;
}

.mood-name {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
  transition: color var(--transition-base);
}

.mood-btn.active .mood-name {
  color: var(--color-primary-dark);
}

.diary-input-area {
  margin-bottom: var(--space-xl);
}

.diary-textarea {
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  font-size: var(--font-md);
  font-family: inherit;
  resize: none; /* 禁止调整大小 */
  background: var(--color-bg-secondary);
  transition: all var(--transition-base);
  color: var(--color-text-primary);
}

.diary-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  background: white;
  box-shadow: var(--shadow-sm);
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.save-btn {
  width: 100%;
  padding: var(--space-md);
  border: none;
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  font-size: var(--font-md);
  cursor: pointer;
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.save-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  filter: brightness(1.1);
}

.save-btn:not(:disabled):active {
  transform: translateY(0);
}

/* 固定底部导航栏 */
.tab-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
