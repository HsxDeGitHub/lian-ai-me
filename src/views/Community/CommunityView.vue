<template>
  <div class="community-view">
    <div class="community-header">
      <h1 class="community-title">🌳 散步广场</h1>
      <button
        @click="showCreatePost = true"
        class="create-post-btn"
        aria-label="创建新帖子"
      >
        <span>+ 发帖</span>
      </button>
    </div>

    <!-- 帖子列表 -->
    <div class="posts-feed" role="feed" aria-label="社区帖子列表">
      <article
        v-for="post in communityStore.feedPosts"
        :key="post.id"
        class="post-card"
      >
        <header class="post-header">
          <span class="post-author">{{ post.author }}</span>
          <time class="post-time" :datetime="post.createdAt">{{ formatTime(post.createdAt) }}</time>
        </header>
        <div class="post-content">
          <div class="post-mood" :aria-label="`心情：${getMoodLabel(post.mood)}`">{{ getMoodIcon(post.mood) }}</div>
          <p class="post-text">{{ post.content }}</p>
        </div>
        <footer class="post-actions">
          <button
            @click="toggleLike(post.id)"
            class="action-btn"
            :class="{ liked: isLiked(post.id) }"
            :aria-label="`${isLiked(post.id) ? '取消点赞' : '点赞'}此帖子，当前${getLikeCount(post.id)}人点赞`"
            :aria-pressed="isLiked(post.id)"
          >
            <span aria-hidden="true">🦴 {{ getLikeCount(post.id) }}</span>
          </button>
          <button
            class="action-btn"
            :aria-label="`查看评论，共${post.comments}条`"
          >
            <span aria-hidden="true">💬 {{ post.comments }}</span>
          </button>
        </footer>
      </article>
    </div>

    <!-- 发帖弹窗 -->
    <div
      v-if="showCreatePost"
      class="modal-overlay"
      @click="closeModal"
      @keydown.esc="closeModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-post-title"
    >
      <div class="modal-content" @click.stop role="document">
        <h2 id="create-post-title" class="modal-title">发布到广场</h2>

        <fieldset class="mood-selector">
          <legend class="mood-selector-legend">选择心情</legend>
          <div class="mood-buttons" role="group" aria-label="心情选项">
            <button
              v-for="mood in MOODS"
              :key="mood.id"
              @click="postMood = mood.id"
              class="mood-btn"
              :class="{ active: postMood === mood.id }"
              :aria-label="`选择${mood.name}心情`"
              :aria-pressed="postMood === mood.id"
            >
              <span class="mood-icon" :aria-label="mood.name">{{ mood.icon }}</span>
            </button>
          </div>
        </fieldset>

        <label for="post-content" class="visually-hidden">帖子内容</label>
        <textarea
          id="post-content"
          v-model="postContent"
          class="post-textarea"
          placeholder="分享你的心情..."
          rows="6"
          :aria-describedby="postContent ? '' : 'content-help'"
        ></textarea>
        <span id="content-help" class="visually-hidden">请输入你想分享的内容</span>

        <div class="modal-actions">
          <button
            @click="closeModal"
            class="cancel-btn"
            aria-label="取消发帖"
          >
            取消
          </button>
          <button
            @click="createPost"
            class="publish-btn"
            :disabled="!postContent.trim()"
            aria-label="发布帖子到广场"
          >
            发布
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
import { useCommunityStore } from '@/stores/community'
import { MOODS } from '@/data/moods'
import { useAchievementStore } from '@/stores/achievements'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 启用相对时间插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const communityStore = useCommunityStore()
const achievementStore = useAchievementStore()

const showCreatePost = ref(false)
const postMood = ref('happy')
const postContent = ref('')

const getMoodIcon = (moodId) => {
  const mood = MOODS.find(m => m.id === moodId)
  return mood?.icon || '😊'
}

const getMoodLabel = (moodId) => {
  const mood = MOODS.find(m => m.id === moodId)
  return mood?.name || '开心'
}

const formatTime = (date) => {
  return dayjs(date).fromNow()
}

const isLiked = (postId) => {
  return communityStore.isPostLiked(postId)
}

const getLikeCount = (postId) => {
  return communityStore.likeCount(postId)
}

const toggleLike = async (postId) => {
  await communityStore.likePost(postId)
}

const closeModal = () => {
  showCreatePost.value = false
  postMood.value = 'happy'
  postContent.value = ''
}

const createPost = async () => {
  if (!postContent.value.trim()) {
    if (window.$toast) {
      window.$toast.warning('请输入内容', { title: '⚠️ 提示' })
    }
    return
  }

  try {
    await communityStore.createPost({
      content: postContent.value,
      mood: postMood.value
    })

    if (window.$toast) {
      window.$toast.success('发布成功！', {
        title: '✅ 发布成功',
        icon: '🌳'
      })
    }
    closeModal()

    // 检查成就
    await achievementStore.checkAllAchievements()
  } catch (error) {
    if (window.$toast) {
      window.$toast.error('发布失败：' + error.message, {
        title: '❌ 发布失败'
      })
    }
  }
}

onMounted(async () => {
  await communityStore.initCommunity()
})
</script>

<style scoped>
/* 可访问性辅助类 */
.community-view {
  min-height: 100vh;
  padding: var(--space-lg);
  padding-bottom: 120px;
  background: var(--gradient-modern-bg);
  max-width: 800px;
  margin: 0 auto;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  padding: 0 4px;
}

.community-title {
  font-size: 28px;
  font-weight: 800;
  background: var(--gradient-rainbow);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.create-post-btn {
  padding: 10px 20px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 140, 148, 0.4);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.create-post-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(255, 140, 148, 0.5);
}

.create-post-btn:active {
  transform: scale(0.95);
}

/* Post Feed */
.posts-feed {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  padding: 20px;
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: rgba(255, 255, 255, 0.9);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.post-author {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-author::before {
  content: "";
  display: block;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
  border-radius: 50%;
}

.post-time {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 600;
  background: rgba(0,0,0,0.03);
  padding: 4px 8px;
  border-radius: 12px;
}

.post-content {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.post-mood {
  font-size: 42px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
  animation: float-emoji 3s ease-in-out infinite;
  min-width: 50px;
  text-align: center;
}

@keyframes float-emoji {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.post-text {
  flex: 1;
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-primary);
}

.post-actions {
  display: flex;
  gap: 16px;
  border-top: 1px solid rgba(0,0,0,0.05);
  padding-top: 12px;
}

.action-btn {
  padding: 8px 16px;
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn:hover {
  background: white;
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.action-btn.liked {
  background: rgba(255, 140, 148, 0.15);
  color: var(--color-primary-dark);
  border-color: rgba(255, 140, 148, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: 20px;
  animation: fade-in 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  transform-origin: center;
  animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes zoom-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 24px;
  text-align: center;
  color: var(--color-text-primary);
}

.mood-selector {
  border: none;
  padding: 0;
  margin-bottom: 24px;
}

.mood-selector-legend {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--color-text-secondary);
  display: block;
  position: static;
  width: auto;
  height: auto;
  clip: auto;
}

.mood-buttons {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}

.mood-buttons::-webkit-scrollbar { display: none; }

.mood-btn {
  padding: 12px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.mood-btn:hover {
  transform: translateY(-2px);
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.mood-btn.active {
  border-color: var(--color-primary);
  background: rgba(255, 140, 148, 0.1);
  transform: scale(1.1);
}

.mood-icon {
  font-size: 28px;
}

.post-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #edf2f7;
  border-radius: 20px;
  font-size: 16px;
  font-family: inherit;
  resize: none;
  margin-bottom: 24px;
  transition: all 0.2s;
  background: #fcfcfc;
}

.post-textarea:focus {
  outline: none;
  border-color: var(--color-primary-light);
  background: white;
  box-shadow: 0 0 0 4px rgba(255, 140, 148, 0.1);
}

.modal-actions {
  display: flex;
  gap: 16px;
}

.cancel-btn,
.publish-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f1f3f5;
  color: var(--color-text-secondary);
}

.cancel-btn:hover {
  background: #e9ecef;
}

.publish-btn {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 140, 148, 0.4);
}

.publish-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 140, 148, 0.5);
}

.publish-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.publish-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
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
