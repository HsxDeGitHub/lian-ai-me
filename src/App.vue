<template>
  <div class="app">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    <router-view v-slot="{ Component, route }">
      <transition :name="getRouteTransition(route)" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Toast from '@/components/common/Toast.vue'

const toastRef = ref(null)

// 根据路由元数据获取过渡效果
const getRouteTransition = (route) => {
  if (route.meta.transition) {
    return route.meta.transition
  }
  // Default transition based on depth could go here
  return 'fade'
}

onMounted(() => {
  // 应用初始化
  console.log('🐕 脱单了么 - 我的小窝')

  // 将toast挂载到全局
  if (toastRef.value) {
    window.$toast = toastRef.value
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--gradient-modern-bg);
  position: relative;
  overflow-x: hidden;
}

.background-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float-shape 20s infinite ease-in-out;
}

.shape-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: rgba(255, 140, 148, 0.2);
  animation-delay: 0s;
}

.shape-2 {
  bottom: -10%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: rgba(162, 225, 250, 0.2);
  animation-delay: -5s;
}

.shape-3 {
  top: 40%;
  left: 40%;
  width: 40vw;
  height: 40vw;
  background: rgba(255, 217, 61, 0.15);
  animation-delay: -10s;
}

@keyframes float-shape {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

/* Global fade transition for router */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
