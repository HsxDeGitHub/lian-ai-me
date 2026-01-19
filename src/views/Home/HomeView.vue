<template>
  <div class="home-view">
    <!-- 场景容器 -->
    <SceneContainer class="scene-container" />

    <!-- 底部导航栏 -->
    <TabBar class="tab-bar" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import SceneContainer from './components/SceneContainer.vue'
import TabBar from './components/TabBar.vue'
import { useUserStore } from '@/stores/user'
import { useTimerStore } from '@/stores/timer'
import { useDogStore } from '@/stores/dog'
import { useCurrencyStore } from '@/stores/currency'
import { useTasksStore } from '@/stores/tasks'
import { useDiaryStore } from '@/stores/diary'
import { useShopStore } from '@/stores/shop'
import { useCommunityStore } from '@/stores/community'
import { useAchievementStore } from '@/stores/achievements'

onMounted(async () => {
  // 初始化所有Store
  await useUserStore().initUser()
  await useTimerStore().initTimer()
  await useDogStore().initDog()
  await useCurrencyStore().initCurrency()
  await useTasksStore().initTasks()
  await useDiaryStore().initDiary()
  await useShopStore().initShop()
  await useCommunityStore().initCommunity()
  await useAchievementStore().initAchievements()

  // 检查里程碑
  useTimerStore().checkMilestones()
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.scene-container {
  flex: 1;
  overflow: hidden;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
}
</style>
