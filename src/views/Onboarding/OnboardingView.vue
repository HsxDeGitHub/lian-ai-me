<template>
  <div class="onboarding-view">
    <div class="onboarding-content">
      <h1 class="title">🐕 欢迎来到狗窝</h1>
      <p class="subtitle">你的单身生活小助手</p>

      <div class="dog-selection">
        <h2>选择你的狗狗</h2>
        <div class="breeds-grid">
          <button
            v-for="breed in unlockedBreeds"
            :key="breed.id"
            @click="selectBreed(breed.id)"
            class="breed-btn"
            :class="{ active: selectedBreed === breed.id }"
          >
            <span class="breed-emoji">{{ breed.emoji }}</span>
            <span class="breed-name">{{ breed.name }}</span>
          </button>
        </div>
      </div>

      <button @click="startJourney" class="start-btn">
        开始我的单身之旅
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useDogStore } from '@/stores/dog'
import { DOG_BREEDS } from '@/data/dogBreeds'

const router = useRouter()
const userStore = useUserStore()
const dogStore = useDogStore()

const selectedBreed = ref('golden-retriever')

const unlockedBreeds = computed(() => {
  return DOG_BREEDS.filter(b => b.unlockAt === 0)
})

const selectBreed = (breedId) => {
  selectedBreed.value = breedId
}

const startJourney = async () => {
  await dogStore.selectBreed(selectedBreed.value)
  await userStore.completeOnboarding()
  router.push('/')
}
</script>

<style scoped>
.onboarding-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--space-lg);
}

.onboarding-content {
  background: var(--color-bg-card);
  padding: var(--space-2xl);
  border-radius: var(--radius-2xl);
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-xl);
}

.title {
  font-size: var(--font-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-md);
}

.subtitle {
  font-size: var(--font-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2xl);
}

.dog-selection {
  margin-bottom: var(--space-2xl);
}

.dog-selection h2 {
  font-size: var(--font-xl);
  margin-bottom: var(--space-lg);
}

.breeds-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.breed-btn {
  padding: var(--space-lg);
  background: var(--color-bg-secondary);
  border: 3px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.breed-btn:hover {
  border-color: var(--color-primary);
}

.breed-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.breed-emoji {
  display: block;
  font-size: var(--font-4xl);
  margin-bottom: var(--space-sm);
}

.breed-name {
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
}

.start-btn {
  width: 100%;
  padding: var(--space-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: all var(--transition-base);
}

.start-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}
</style>
