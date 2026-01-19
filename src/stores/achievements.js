import { defineStore } from 'pinia'
import { saveToStorage, loadFromStorage } from '@/utils/helpers'
import { ACHIEVEMENTS } from '@/data/achievements'
import { useCurrencyStore } from './currency'
import { useUserStore } from './user'
import { useDogStore } from './dog'
import { useTasksStore } from './tasks'
import { useDiaryStore } from './diary'
import { useShopStore } from './shop'

export const useAchievementStore = defineStore('achievements', {
  state: () => ({
    unlocked: [],
    pending: []
  }),

  getters: {
    totalUnlocked() {
      return this.unlocked.length
    },

    unlockedByCategory() {
      return (category) => {
        return this.unlocked.filter(
          a => a.category === category
        )
      }
    },

    progress() {
      const total = ACHIEVEMENTS.length
      const unlocked = this.unlocked.length
      return Math.round((unlocked / total) * 100)
    },

    isUnlocked() {
      return (achievementId) => {
        return this.unlocked.some(a => a.id === achievementId)
      }
    }
  },

  actions: {
    async initAchievements() {
      const saved = await loadFromStorage('achievements')
      if (saved) {
        this.$patch(saved)
      }
    },

    async checkAchievements(type, value) {
      const achievements = ACHIEVEMENTS.filter(
        a => a.trigger?.type === type
      )

      for (const achievement of achievements) {
        if (this.isUnlocked(achievement.id)) {
          continue // 已解锁
        }

        const shouldUnlock = this.evaluateCondition(
          achievement.trigger.condition,
          value
        )

        if (shouldUnlock) {
          await this.unlockAchievement(achievement)
        }
      }
    },

    evaluateCondition(condition, value) {
      switch (condition.operator) {
        case 'gte':
          return value >= condition.value
        case 'equals':
          return value === condition.value
        case 'in':
          return condition.value.includes(value)
        default:
          return false
      }
    },

    async unlockAchievement(achievement) {
      const currencyStore = useCurrencyStore()

      this.unlocked.push({
        ...achievement,
        unlockedAt: new Date().toISOString()
      })

      // 发放奖励
      if (achievement.reward) {
        await currencyStore.earn(
          achievement.reward.bones || 0,
          'achievement',
          `解锁成就: ${achievement.title}`
        )
      }

      await saveToStorage('achievements', this.$state)

      // 触发成就解锁动画（在组件中处理）
      return achievement
    },

    async checkAllAchievements() {
      const userStore = useUserStore()
      const dogStore = useDogStore()
      const tasksStore = useTasksStore()
      const diaryStore = useDiaryStore()
      const shopStore = useShopStore()
      const currencyStore = useCurrencyStore()

      // 检查各种成就
      await this.checkAchievements('single_days', userStore.singleDays)
      await this.checkAchievements('diary_entries', diaryStore.entries.length)
      await this.checkAchievements('diary_streak', diaryStore.streak)
      await this.checkAchievements('tasks_completed', tasksStore.completedTasks.length)
      await this.checkAchievements('dog_interactions', dogStore.interactionCount)
      await this.checkAchievements('house_level', dogStore.houseLevel)
      await this.checkAchievements('items_purchased', shopStore.totalPurchased)
      await this.checkAchievements('total_earned', currencyStore.totalEarned)
      await this.checkAchievements('posts_created', shopStore.totalPurchased) // 暂时用shop数据
    }
  }
})
