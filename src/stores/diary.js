import { defineStore } from 'pinia'
import { saveToStorage, loadFromStorage, generateId } from '@/utils/helpers'
import { useDogStore } from './dog'
import { useAchievementStore } from './achievements'
import dayjs from 'dayjs'

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    entries: [],
    currentEntry: null,
    draft: null
  }),

  getters: {
    entriesByMonth() {
      const grouped = {}

      this.entries.forEach(entry => {
        const month = dayjs(entry.createdAt).format('YYYY-MM')
        if (!grouped[month]) {
          grouped[month] = []
        }
        grouped[month].push(entry)
      })

      return grouped
    },

    moodDistribution() {
      const distribution = {}

      this.entries.forEach(entry => {
        const mood = entry.mood
        distribution[mood] = (distribution[mood] || 0) + 1
      })

      return distribution
    },

    recentEntries() {
      return this.entries.slice(0, 20)
    },

    streak() {
      if (this.entries.length === 0) return 0

      let streak = 0
      let currentDate = dayjs()

      for (let i = 0; i < 365; i++) {
        const dateStr = currentDate.format('YYYY-MM-DD')
        const hasEntry = this.entries.some(e =>
          dayjs(e.createdAt).format('YYYY-MM-DD') === dateStr
        )

        if (hasEntry) {
          streak++
          currentDate = currentDate.subtract(1, 'day')
        } else {
          break
        }
      }

      return streak
    }
  },

  actions: {
    async initDiary() {
      const saved = await loadFromStorage('diary')
      if (saved) {
        this.$patch(saved)
      }
    },

    async createEntry(data) {
      const entry = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      this.entries.unshift(entry)
      await saveToStorage('diary', this.$state)

      // 更新狗狗心情
      const dogStore = useDogStore()
      dogStore.updateMood(data.mood)

      // 检查成就
      const achievementStore = useAchievementStore()
      await achievementStore.checkAchievements('diary_entries', this.entries.length)
      await achievementStore.checkAchievements('diary_streak', this.streak)

      // 清除草稿
      this.clearDraft()

      return entry
    },

    async updateEntry(id, data) {
      const index = this.entries.findIndex(e => e.id === id)

      if (index !== -1) {
        this.entries[index] = {
          ...this.entries[index],
          ...data,
          updatedAt: new Date().toISOString()
        }

        await saveToStorage('diary', this.$state)
      }
    },

    async deleteEntry(id) {
      this.entries = this.entries.filter(e => e.id !== id)
      await saveToStorage('diary', this.$state)
    },

    getEntry(id) {
      return this.entries.find(e => e.id === id)
    },

    saveDraft(data) {
      this.draft = {
        ...this.draft,
        ...data,
        savedAt: new Date().toISOString()
      }
      saveToStorage('diary', this.$state)
    },

    clearDraft() {
      this.draft = null
      saveToStorage('diary', this.$state)
    }
  }
})
