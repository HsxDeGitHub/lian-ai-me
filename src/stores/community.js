import { defineStore } from 'pinia'
import { saveToStorage, loadFromStorage, generateId } from '@/utils/helpers'
import { MOCK_POSTS } from '@/data/mockPosts'
import { useAchievementStore } from './achievements'

export const useCommunityStore = defineStore('community', {
  state: () => ({
    posts: [],
    treeHolePosts: [],
    currentUserPosts: [],
    likes: [],
    comments: []
  }),

  getters: {
    feedPosts() {
      return [...this.posts, ...MOCK_POSTS].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    },

    isPostLiked() {
      return (postId) => {
        return this.likes.some(like => like.postId === postId)
      }
    },

    likeCount() {
      return (postId) => {
        return this.likes.filter(like => like.postId === postId).length
      }
    },

    getPostComments() {
      return (postId) => {
        return this.comments.filter(
          comment => comment.postId === postId
        )
      }
    },

    totalPostsCreated() {
      return this.currentUserPosts.length
    }
  },

  actions: {
    async initCommunity() {
      const saved = await loadFromStorage('community')
      if (saved) {
        this.$patch(saved)
      }
    },

    async createPost(data, isTreeHole = false) {
      const post = {
        id: generateId(),
        ...data,
        isTreeHole,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0
      }

      if (isTreeHole) {
        this.treeHolePosts.unshift(post)
      } else {
        this.posts.unshift(post)
      }

      this.currentUserPosts.unshift(post.id)

      // 检查成就
      const achievementStore = useAchievementStore()
      await achievementStore.checkAchievements('posts_created', this.totalPostsCreated)

      await saveToStorage('community', this.$state)

      return post
    },

    async likePost(postId) {
      const existingLike = this.likes.find(
        like => like.postId === postId
      )

      if (existingLike) {
        // 取消点赞
        this.likes = this.likes.filter(
          like => like.postId !== postId
        )
      } else {
        // 点赞
        this.likes.push({
          id: generateId(),
          postId,
          createdAt: new Date().toISOString()
        })
      }

      await saveToStorage('community', this.$state)
    },

    async addComment(postId, content) {
      const comment = {
        id: generateId(),
        postId,
        content,
        createdAt: new Date().toISOString(),
        likes: 0
      }

      this.comments.push(comment)

      await saveToStorage('community', this.$state)

      return comment
    },

    getPost(postId) {
      return this.posts.find(p => p.id === postId) ||
             this.treeHolePosts.find(p => p.id === postId)
    }
  }
})
