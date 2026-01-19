import { defineStore } from 'pinia'
import { saveToStorage, loadFromStorage, generateId } from '@/utils/helpers'
import { TASK_TEMPLATES } from '@/data/tasks'
import { useCurrencyStore } from './currency'
import { useAchievementStore } from './achievements'
import dayjs from 'dayjs'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    availableTasks: [],
    activeTasks: [],
    completedTasks: [],
    completedToday: 0,
    lastResetDate: null
  }),

  getters: {
    pendingTasks() {
      return this.activeTasks.filter(t => !t.completed)
    },

    todayProgress() {
      const total = this.activeTasks.length
      const completed = this.completedToday
      return total > 0 ? Math.round((completed / total) * 100) : 0
    },

    totalRewards() {
      return this.completedTasks.reduce(
        (sum, t) => sum + (t.reward || 0),
        0
      )
    }
  },

  actions: {
    async initTasks() {
      const saved = await loadFromStorage('tasks')
      if (saved) {
        this.$patch(saved)
      }

      // 确保 availableTasks 始终从模板初始化
      if (!this.availableTasks || this.availableTasks.length === 0) {
        this.availableTasks = TASK_TEMPLATES.map(t => ({
          ...t,
          id: generateId(),
          completed: false,
          progress: 0
        }))
      }

      // 重置每日任务
      this.resetDailyTasks()
    },

    resetDailyTasks() {
      const today = dayjs().format('YYYY-MM-DD')

      // 如果日期变化或者 activeTasks 为空，则重置
      if (this.lastResetDate !== today || !this.activeTasks || this.activeTasks.length === 0) {
        this.activeTasks = this.availableTasks
          .filter(t => t.frequency === 'daily')
          .map(t => ({
            ...t,
            id: generateId(),
            completed: false,
            progress: 0,
            resetAt: new Date().toISOString()
          }))

        this.completedToday = 0
        this.lastResetDate = today
        saveToStorage('tasks', this.$state)
      }
    },

    async completeTask(taskId, proof = null) {
      const task = this.activeTasks.find(t => t.id === taskId)

      if (!task || task.completed) {
        throw new Error('任务不存在或已完成')
      }

      task.completed = true
      task.completedAt = new Date().toISOString()
      task.proof = proof

      this.completedTasks.unshift(task)
      this.completedToday++

      // 发放奖励
      const currencyStore = useCurrencyStore()
      await currencyStore.earn(
        task.reward,
        'task',
        `完成任务: ${task.title}`
      )

      // 检查成就
      const achievementStore = useAchievementStore()
      await achievementStore.checkAchievements('tasks', this.completedTasks.length)

      saveToStorage('tasks', this.$state)

      return task
    },

    getActiveTask(taskId) {
      return this.activeTasks.find(t => t.id === taskId)
    }
  }
})
