import { defineStore } from 'pinia'
import { saveToStorage, loadFromStorage } from '@/utils/helpers'
import { DOG_BREEDS } from '@/data/dogBreeds'
import { MOODS, MOOD_ANIMATIONS } from '@/data/moods'

export const useDogStore = defineStore('dog', {
  state: () => ({
    breed: 'golden-retriever', // 品种ID
    name: '旺财',
    mood: 'happy', // 当前心情
    energy: 100, // 活力值
    accessories: [], // 已购买的饰品
    currentAnimation: 'idle', // 当前动画
    houseLevel: 1, // 狗屋等级
    houseItems: [], // 已放置的家具
    lastInteraction: null, // 最后互动时间
    interactionCount: 0 // 互动次数
  }),

  getters: {
    dogInfo() {
      return DOG_BREEDS.find(b => b.id === this.breed)
    },

    moodVariant() {
      const moodMap = {
        happy: 'happy',
        excited: 'happy',
        calm: 'calm',
        sad: 'sad',
        bored: 'bored',
        sleepy: 'sleeping'
      }
      return moodMap[this.mood] || 'idle'
    },

    moodInfo() {
      return MOODS.find(m => m.id === this.mood)
    },

    needsAttention() {
      if (!this.lastInteraction) return true
      const hoursSinceInteraction = Math.floor(
        (Date.now() - new Date(this.lastInteraction).getTime()) / (1000 * 60 * 60)
      )
      return hoursSinceInteraction > 24
    },

    unlockedBreeds() {
      const userStore = import('./user').then(m => m.useUserStore)
      // 简化版本，实际中需要从user store获取单身天数
      return DOG_BREEDS.filter(b => b.unlockAt === 0)
    }
  },

  actions: {
    async initDog() {
      const saved = await loadFromStorage('dog')
      if (saved) {
        this.$patch(saved)
      }
    },

    async selectBreed(breedId) {
      this.breed = breedId
      this.currentAnimation = 'happy'
      await saveToStorage('dog', this.$state)
    },

    updateMood(mood) {
      this.mood = mood
      this.currentAnimation = MOOD_ANIMATIONS[mood] || 'idle'
      saveToStorage('dog', this.$state)
    },

    interact(action) {
      this.lastInteraction = new Date().toISOString()
      this.interactionCount++
      this.energy = Math.min(100, this.energy + 10)

      const interactionAnimations = {
        pet: 'happy',
        feed: 'happy',
        play: 'jump',
        talk: 'tail-wag'
      }

      this.currentAnimation = interactionAnimations[action] || 'happy'

      setTimeout(() => {
        this.currentAnimation = 'idle'
      }, 3000)

      saveToStorage('dog', this.$state)
    },

    addAccessory(item) {
      this.accessories.push({
        ...item,
        equippedAt: new Date().toISOString()
      })
      saveToStorage('dog', this.$state)
    },

    upgradeHouse(level) {
      this.houseLevel = level
      saveToStorage('dog', this.$state)
    },

    addHouseItem(item) {
      // 检查是否已存在
      if (!this.houseItems.find(i => i.id === item.id)) {
        this.houseItems.push({
          ...item,
          placedAt: new Date().toISOString()
        })
        saveToStorage('dog', this.$state)
      }
    },

    consumeEnergy(amount) {
      this.energy = Math.max(0, this.energy - amount)
      saveToStorage('dog', this.$state)
    },

    restoreEnergy() {
      this.energy = 100
      saveToStorage('dog', this.$state)
    }
  }
})
