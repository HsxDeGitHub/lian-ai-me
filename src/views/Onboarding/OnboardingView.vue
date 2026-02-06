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
  background: var(--gradient-modern-bg);
  padding: var(--space-lg);
  position: relative;
  overflow: hidden;
}

.onboarding-view::before {
  content: "";
  position: absolute;
  top: -10%;
  right: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(255, 140, 148, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: float-bg 15s infinite ease-in-out;
}

.onboarding-view::after {
  content: "";
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, rgba(143, 218, 154, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: float-bg 20s infinite ease-in-out reverse;
}

@keyframes float-bg {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, 20px); }
}

.onboarding-content {
  background: var(--glass-heavy-bg);
  backdrop-filter: var(--glass-heavy-backdrop);
  padding: 40px;
  border-radius: 32px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-xl);
  border: var(--glass-border);
  position: relative;
  z-index: 10;
  animation: fade-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.subtitle {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  font-weight: 500;
}

.dog-selection {
  margin-bottom: 32px;
}

.dog-selection h2 {
  font-size: 18px;
  margin-bottom: 16px;
  color: var(--color-text-primary);
  font-weight: 700;
}

.breeds-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.breed-btn {
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.breed-btn:hover {
  background: white;
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.breed-btn.active {
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 8px 25px rgba(255, 140, 148, 0.3);
  transform: scale(1.05);
}

.breed-emoji {
  display: block;
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
  transition: transform 0.3s ease;
}

.breed-btn.active .breed-emoji {
  transform: scale(1.1) rotate(5deg);
}

.breed-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.start-btn {
  width: 100%;
  padding: 16px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 15px rgba(255, 140, 148, 0.4);
  position: relative;
  overflow: hidden;
}

.start-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.start-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(255, 140, 148, 0.5);
}

.start-btn:hover::after {
  transform: translateX(100%);
}

.start-btn:active {
  transform: scale(0.98);
}
</style>
