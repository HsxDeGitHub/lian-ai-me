import { defineStore } from 'pinia'
import { saveToStorage, loadFromStorage } from '@/utils/helpers'
import dayjs from 'dayjs'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    nickname: '铲屎官',
    avatar: '',
    status: 'enjoying', // enjoying, seeking, chill, taken
    startDate: dayjs().subtract(30, 'day').toISOString(), // 默认单身30天
    settings: {
      notifications: true,
      soundEnabled: true,
      theme: 'auto', // auto, light, dark
      language: 'zh-CN'
    },
    isFirstTime: true,
    onboardingCompleted: false
  }),

  getters: {
    statusText: (state) => {
      const statusMap = {
        enjoying: '享受单身',
        seeking: '积极寻找',
        chill: '随缘佛系',
        taken: '心有所属'
      }
      return statusMap[state.status] || '未知状态'
    },

    singleDays: (state) => {
      if (!state.startDate) return 0
      return dayjs().diff(dayjs(state.startDate), 'day')
    }
  },

  actions: {
    async initUser() {
      const saved = await loadFromStorage('user')
      if (saved) {
        this.$patch(saved)
      }
    },

    updateProfile(data) {
      this.$patch(data)
      saveToStorage('user', this.$state)
    },

    setStartDate(date) {
      this.startDate = date
      saveToStorage('user', this.$state)
    },

    setStatus(status) {
      this.status = status
      saveToStorage('user', this.$state)
    },

    updateSettings(settings) {
      this.settings = { ...this.settings, ...settings }
      saveToStorage('user', this.$state)
    },

    completeOnboarding() {
      this.onboardingCompleted = true
      this.isFirstTime = false
      saveToStorage('user', this.$state)
    }
  }
})
