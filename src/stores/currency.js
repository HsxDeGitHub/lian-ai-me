import { defineStore } from 'pinia'
import { saveToStorage, loadFromStorage, generateId } from '@/utils/helpers'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    balance: 100, // 初始赠送100骨头币
    transactions: [], // 交易记录
    dailyBonusClaimed: false, // 每日签到
    lastClaimDate: null
  }),

  getters: {
    totalEarned() {
      return this.transactions
        .filter(t => t.type === 'earn')
        .reduce((sum, t) => sum + t.amount, 0)
    },

    totalSpent() {
      return this.transactions
        .filter(t => t.type === 'spend')
        .reduce((sum, t) => sum + t.amount, 0)
    },

    recentTransactions() {
      return this.transactions.slice(0, 10)
    },

    canClaimDaily() {
      const today = new Date().toDateString()
      return this.lastClaimDate !== today
    }
  },

  actions: {
    async initCurrency() {
      const saved = await loadFromStorage('currency')
      if (saved) {
        this.$patch(saved)
      }

      // 重置每日签到状态
      const today = new Date().toDateString()
      if (this.lastClaimDate !== today) {
        this.dailyBonusClaimed = false
      }
    },

    async earn(amount, source, description = '') {
      this.balance += amount

      this.transactions.unshift({
        id: generateId(),
        type: 'earn',
        amount,
        source,
        description,
        timestamp: new Date().toISOString()
      })

      await saveToStorage('currency', this.$state)

      // 触发获得骨头币动画（在组件中处理）
      return amount
    },

    async spend(amount, item, description = '') {
      if (this.balance < amount) {
        throw new Error('骨头币不足')
      }

      this.balance -= amount

      this.transactions.unshift({
        id: generateId(),
        type: 'spend',
        amount,
        item,
        description,
        timestamp: new Date().toISOString()
      })

      await saveToStorage('currency', this.$state)

      return amount
    },

    async claimDailyBonus() {
      if (!this.canClaimDaily) {
        throw new Error('今日已领取')
      }

      const bonus = 50 // 每日奖励
      await this.earn(bonus, 'daily', '每日签到奖励')

      this.dailyBonusClaimed = true
      this.lastClaimDate = new Date().toDateString()

      await saveToStorage('currency', this.$state)

      return bonus
    }
  }
})
