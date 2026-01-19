import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { saveToStorage, loadFromStorage } from '@/utils/helpers'
import { useUserStore } from './user'
import dayjs from 'dayjs'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    milestones: [
      { days: 100, achieved: false, celebratedAt: null },
      { days: 365, achieved: false, celebratedAt: null },
      { days: 520, achieved: false, celebratedAt: null },
      { days: 1000, achieved: false, celebratedAt: null }
    ],
    recentMilestones: [] // 已达到的里程碑
  }),

  getters: {
    duration() {
      const userStore = useUserStore()
      if (!userStore.startDate) return null

      const start = dayjs(userStore.startDate)
      const now = dayjs()

      return {
        years: now.diff(start, 'year'),
        months: now.diff(start, 'month') % 12,
        days: now.diff(start, 'day') % 30,
        hours: now.diff(start, 'hour') % 24,
        minutes: now.diff(start, 'minute') % 60,
        seconds: now.diff(start, 'second') % 60,
        totalDays: now.diff(start, 'day'),
        totalHours: now.diff(start, 'hour')
      }
    },

    timeString() {
      const duration = this.duration
      if (!duration) return '0天0小时0分0秒'

      const { years, months, days, hours, minutes, seconds } = duration

      let result = []
      if (years > 0) result.push(`${years}年`)
      if (months > 0) result.push(`${months}个月`)
      if (days > 0) result.push(`${days}天`)
      if (years === 0) {
        result.push(`${hours}小时`)
        result.push(`${minutes}分`)
        result.push(`${seconds}秒`)
      }

      return result.join('')
    },

    nextMilestone() {
      return this.milestones.find(m => !m.achieved)
    },

    progressToNextMilestone() {
      const next = this.nextMilestone
      if (!next) return 100

      const current = this.duration?.totalDays || 0
      const prevMilestone = this.milestones
        .filter(m => m.achieved)
        .sort((a, b) => b.days - a.days)[0]

      const prevDays = prevMilestone ? prevMilestone.days : 0
      return ((current - prevDays) / (next.days - prevDays)) * 100
    }
  },

  actions: {
    async initTimer() {
      const saved = await loadFromStorage('timer')
      if (saved) {
        this.$patch(saved)
      }
    },

    checkMilestones() {
      const days = this.duration?.totalDays || 0

      this.milestones.forEach(m => {
        if (!m.achieved && days >= m.days) {
          m.achieved = true
          m.celebratedAt = new Date().toISOString()
          this.recentMilestones.unshift({
            ...m,
            celebratedAt: m.celebratedAt
          })
          // 触发庆祝动画（在组件中处理）
        }
      })

      saveToStorage('timer', this.$state)
    },

    clearRecentMilestones() {
      this.recentMilestones = []
      saveToStorage('timer', this.$state)
    }
  }
})
