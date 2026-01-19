<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 应用初始化
  console.log('🐕 脱单了么 - 我的小窝')
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--color-bg-primary);
}
</style>
