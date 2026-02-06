<template>
  <div class="scene-container" :class="sceneClass">
    <!-- 背景装饰 -->
    <div class="scene-background">
      <div class="sun" v-if="isDay"></div>
      <div class="moon" v-else></div>
      <div class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
      <!-- 可爱装饰元素 -->
      <div class="cute-decorations">
        <span class="deco-heart deco-1">💕</span>
        <span class="deco-paw deco-2">🐾</span>
        <span class="deco-star deco-3">✨</span>
        <span class="deco-heart deco-4">💖</span>
        <span class="deco-star deco-5">⭐</span>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="scene-content">
      <!-- 顶部状态栏 -->
      <div class="top-bar" role="banner">
        <!-- 骨头币显示 -->
        <div class="currency-display" aria-label="骨头币余额">
          <span class="coin-icon" aria-hidden="true">🦴</span>
          <span class="coin-amount">{{ currencyStore.balance }}</span>
        </div>

        <!-- 设置按钮 -->
        <router-link
          to="/profile"
          class="settings-btn"
          aria-label="前往个人中心设置"
          role="button"
        >
          <span aria-hidden="true">⚙️</span>
        </router-link>
      </div>

      <!-- 计时器卡片 -->
      <div
        class="timer-card animate-fade-in-up hover-lift"
        role="region"
        aria-labelledby="timer-label"
      >
        <div id="timer-label" class="timer-label">单身时长</div>
        <div class="timer-display" aria-live="polite" aria-atomic="true">{{ timeString }}</div>
        <div class="timer-stats" role="list">
          <div class="stat-item" role="listitem">
            <span class="stat-icon" aria-hidden="true">🎯</span>
            <span class="stat-text">{{ singleDays }}天</span>
          </div>
          <div class="stat-item" role="listitem">
            <span class="stat-icon" aria-hidden="true">{{ dogStore.dogInfo?.icon || "🐕" }}</span>
            <span class="stat-text">{{ dogStore.name }}</span>
          </div>
          <div class="stat-item" role="listitem">
            <span class="stat-icon" aria-hidden="true">💕</span>
            <span class="stat-text">好感度 {{ dogStore.interactionCount }}</span>
          </div>
        </div>
      </div>

      <!-- 狗狗场景 -->
      <div class="dog-scene" aria-label="狗狗活动场景">
        <!-- 装饰背景层 -->
        <div class="scene-decor-layer" aria-hidden="true">
          <div class="pond">
            <div class="water-reflection"></div>
            <div class="duck">🦆</div>
          </div>
          <div class="grass-patch"></div>
        </div>

        <!-- 狗屋 (草屋) -->
        <div class="dog-house cottage-style" :class="`house-level-${dogStore.houseLevel}`" aria-hidden="true">
          <div class="chimney">
            <div class="smoke"></div>
          </div>
          <div class="house-roof cottage-roof">
            <div class="roof-texture"></div>
          </div>
          <div class="house-body cottage-body">
            <div class="house-window"></div>
            <div class="house-door"></div>
            <div class="vines">🌿</div>
          </div>
        </div>

        <!-- 已放置的家具 -->
        <div class="placed-furniture" role="list" :aria-label="`已放置的家具，共${visibleFurniture.length}件`">
          <div
            v-for="item in visibleFurniture"
            :key="item.instanceId || item.id"
            class="furniture-item"
            :class="getQualityClass(item.rarity)"
            :style="{
              left: (item.position?.x || 50) + '%',
              bottom: (item.position?.y || 10) + '%'
            }"
            role="listitem"
            :aria-label="`${item.name}，${item.description || ''}`"
          >
            {{ item.icon }}
          </div>
        </div>

        <!-- 狗狗 -->
        <button
          class="dog-character hover-scale"
          :class="dogAnimationClass"
          @click="interactWithDog"
          :aria-label="`和${dogStore.name}互动，当前心情：${moodText}`"
          :title="`点击和${dogStore.name}互动`"
        >
          <div class="dog-emoji" aria-hidden="true">{{ dogStore.dogInfo?.emoji || "🐶" }}</div>
          <div
            class="dog-mood-indicator animate-pulse-glow"
            :style="{ backgroundColor: dogStore.moodInfo?.color }"
            :aria-label="`${dogStore.name}的心情指示器`"
          ></div>
          <!-- 心形效果 -->
          <div class="heart-float animate-fade-in-slide" v-if="showHeart" aria-hidden="true">💕</div>
          <!-- 装饰品 -->
          <div v-if="dogStore.accessories.length > 0" class="dog-accessories" aria-hidden="true">
            <span
              v-for="accessory in dogStore.accessories"
              :key="accessory.id"
              class="accessory-item"
            >
              {{ accessory.icon }}
            </span>
          </div>
        </button>

        <!-- 狗狗状态 -->
        <div class="dog-status" role="status" aria-live="polite">
          <div class="energy-bar" role="progressbar" :aria-valuenow="dogStore.energy" aria-valuemin="0" aria-valuemax="100" :aria-label="`${dogStore.name}的活力值：${dogStore.energy}%`">
            <div
              class="energy-fill"
              :style="{ width: dogStore.energy + '%' }"
            ></div>
          </div>
          <div class="status-text">{{ moodText }}</div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions" role="group" aria-label="快捷操作">
        <button
          @click="openDiary"
          class="action-btn"
          :aria-label="`打开日记，记录当前心情`"
        >
          <span class="action-icon" aria-hidden="true">📝</span>
          <span class="action-label">记心情</span>
        </button>
        <button
          @click="goToTasks"
          class="action-btn"
          aria-label="查看并完成任务，获取奖励"
        >
          <span class="action-icon" aria-hidden="true">⭐</span>
          <span class="action-label">做任务</span>
        </button>
        <button
          @click="goToShop"
          class="action-btn"
          aria-label="前往商店购买物品和食物"
        >
          <span class="action-icon" aria-hidden="true">🛒</span>
          <span class="action-label">逛商店</span>
        </button>
        <button
          @click="goToRoomDecorator"
          class="action-btn highlight-btn"
          aria-label="布置小屋，放置家具和装饰"
        >
          <span class="action-icon" aria-hidden="true">🏡</span>
          <span class="action-label">布置小屋</span>
        </button>
      </div>
    </div>

    <!-- 狗狗互动面板 -->
    <DogInteractionModal
      :show="showInteractionModal"
      @close="closeInteractionModal"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useTimerStore } from "@/stores/timer";
import { useDogStore } from "@/stores/dog";
import { useCurrencyStore } from "@/stores/currency";
import { useRoomStore } from "@/stores/room";
import DogInteractionModal from "@/components/dog/DogInteractionModal.vue";
import { useTimer } from "@/composables/useTimer";
import dayjs from "dayjs";

const router = useRouter();
const userStore = useUserStore();
const timerStore = useTimerStore();
const dogStore = useDogStore();
const currencyStore = useCurrencyStore();
const roomStore = useRoomStore();

// 场景状态
const isDay = ref(true);
const showHeart = ref(false);
const showInteractionModal = ref(false);

// 用于强制更新的响应式变量
const timerKey = ref(0);

// 直接在组件中计算单身时长，确保实时更新
const singleDays = computed(() => {
  // 依赖 timerKey 以确保每秒都重新计算
  timerKey.value;
  if (!userStore.startDate) return 0;
  return dayjs().diff(dayjs(userStore.startDate), 'day');
});

const timeString = computed(() => {
  // 依赖 timerKey 以确保每秒都重新计算
  timerKey.value;
  if (!userStore.startDate) return '0天0小时0分0秒';

  const start = dayjs(userStore.startDate);
  const now = dayjs();

  const years = now.diff(start, 'year');
  const months = now.diff(start, 'month') % 12;
  const days = now.diff(start, 'day') % 30;
  const hours = now.diff(start, 'hour') % 24;
  const minutes = now.diff(start, 'minute') % 60;
  const seconds = now.diff(start, 'second') % 60;

  let result = [];
  if (years > 0) result.push(`${years}年`);
  if (months > 0) result.push(`${months}个月`);
  if (days > 0) result.push(`${days}天`);
  if (years === 0) {
    result.push(`${hours}小时`);
    result.push(`${minutes}分`);
    result.push(`${seconds}秒`);
  }

  return result.length > 0 ? result.join('') : '0天0小时0分0秒';
});

// 计算属性
const sceneClass = computed(() => {
  const hour = new Date().getHours();
  isDay.value = hour >= 6 && hour < 18;
  return isDay.value ? "day-scene" : "night-scene";
});

const dogAnimationClass = computed(() => {
  const animations = {
    happy: "animate-tail-wag",
    excited: "animate-jump",
    calm: "animate-breathe",
    sad: "",
    bored: "",
    sleepy: "animate-breathe",
  };
  return animations[dogStore.mood] || "animate-breathe";
});

const moodText = computed(() => {
  const moodTexts = {
    happy: "很开心",
    excited: "超兴奋",
    calm: "很平静",
    sad: "有点难过",
    bored: "有点无聊",
    sleepy: "想睡觉",
    proud: "很自豪",
    grateful: "很感恩",
  };
  return moodTexts[dogStore.mood] || "心情不错";
});

// 获取已放置的家具（按位置排序，y值小的在前面）
const visibleFurniture = computed(() => {
  return [...(dogStore.houseItems || [])].sort((a, b) => {
    return (a.position?.y || 0) - (b.position?.y || 0);
  });
});

// 获取稀有度样式类
const getQualityClass = (rarity) => {
  return `quality-${rarity}`;
};

// 方法
const interactWithDog = () => {
  // 打开互动面板
  showInteractionModal.value = true;
};

const closeInteractionModal = () => {
  showInteractionModal.value = false;
};

const openDiary = () => {
  router.push("/diary");
};

const goToTasks = () => {
  router.push("/tasks");
};

const goToShop = () => {
  router.push("/shop");
};

const goToRoomDecorator = () => {
  router.push("/room");
};

// 使用 useTimer composable，自动清理定时器
const { start: startTimer } = useTimer(() => {
  // 每秒触发响应式更新
  timerKey.value++;
  timerStore.checkMilestones();
}, 1000);

onMounted(() => {
  startTimer();
});
</script>

<style scoped>
/* Main Scene - Premium Update */
.scene-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  transition: background 1.5s ease-in-out;
}

.scene-container.day-scene {
  background: var(--gradient-modern-bg);
}

.scene-container.night-scene {
  background: linear-gradient(180deg, #1a2980 0%, #26d0ce 100%);
}

/* 背景装饰 */
.scene-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.sun {
  position: absolute;
  top: 5%;
  right: 10%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at 30% 30%, #fff7e6, #ffd93d);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(255, 217, 61, 0.6), 0 0 80px rgba(255, 179, 71, 0.4);
  animation: breathe 4s ease-in-out infinite;
  z-index: 10;
}

.sun::before {
  content: "☀️";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  opacity: 0.8;
}

.moon {
  position: absolute;
  top: 5%;
  right: 10%;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 30% 30%, #ffffff, #f0f0f0);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4);
  z-index: 10;
}

.moon::before {
  content: "🌙";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
}

/* 可爱装饰元素 */
.cute-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cute-decorations span {
  position: absolute;
  font-size: 24px;
  opacity: 0.6;
  animation: float-up 8s ease-in-out infinite;
  filter: blur(0.5px);
}

.deco-1 { top: 20%; left: 10%; animation-delay: 0s; font-size: 28px; }
.deco-2 { top: 60%; left: 5%; animation-delay: 2s; font-size: 20px; }
.deco-3 { top: 30%; right: 15%; animation-delay: 1s; font-size: 24px; }
.deco-4 { top: 70%; right: 10%; animation-delay: 3s; font-size: 22px; }
.deco-5 { top: 15%; left: 30%; animation-delay: 4s; font-size: 18px; }

@keyframes float-up {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-20px) rotate(10deg); opacity: 0.7; }
}

.clouds {
  position: absolute;
  inset: 0;
  opacity: 0.8;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 100px;
  animation: float 40s linear infinite;
  backdrop-filter: blur(5px);
}

.cloud-1 { width: 140px; height: 50px; top: 15%; left: -140px; animation-duration: 45s; }
.cloud-2 { width: 100px; height: 40px; top: 25%; left: -100px; animation-duration: 35s; animation-delay: 5s; }
.cloud-3 { width: 180px; height: 70px; top: 10%; left: -180px; animation-duration: 55s; animation-delay: 10s; }

@keyframes float {
  from { transform: translateX(-200px); }
  to { transform: translateX(calc(100vw + 200px)); }
}

/* 主内容 */
.scene-content {
  position: relative;
  z-index: 1;
  padding: var(--space-lg);
  padding-bottom: 120px; /* Space for floating navbar */
  max-width: 600px;
  margin: 0 auto;
}

/* 顶部状态栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.currency-display {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--glass-heavy-bg);
  backdrop-filter: var(--glass-heavy-backdrop);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
  transition: all var(--transition-bounce);
}

.currency-display:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-glow);
}

.coin-icon {
  font-size: var(--font-xl);
  animation: wiggle 3s ease-in-out infinite;
}

.coin-amount {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.settings-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-heavy-bg);
  backdrop-filter: var(--glass-heavy-backdrop);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
  font-size: var(--font-lg);
  text-decoration: none;
  transition: all var(--transition-bounce);
  color: var(--color-text-secondary);
}

.settings-btn:hover {
  transform: rotate(90deg) scale(1.1);
  color: var(--color-primary);
  box-shadow: var(--shadow-cute);
}

/* 计时器卡片 */
.timer-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: var(--glass-backdrop);
  border-radius: var(--radius-2xl);
  padding: var(--space-xl) var(--space-lg);
  margin-bottom: var(--space-2xl);
  box-shadow: var(--shadow-cute);
  text-align: center;
  border: var(--glass-border);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.timer-card:hover {
  transform: translateY(-5px);
}

.timer-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: shine 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shine {
  0% { transform: translateX(-150%) rotate(45deg); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateX(150%) rotate(45deg); opacity: 0; }
}

.timer-label {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: var(--font-bold);
  opacity: 0.7;
}

.timer-display {
  font-size: clamp(28px, 8vw, 42px);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--space-md);
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.05);
}

.timer-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.5);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255,255,255,0.5);
}

.stat-icon { font-size: 16px; }
.stat-text {
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  color: var(--color-text-secondary);
}

/* 狗狗场景 */
.dog-scene {
  position: relative;
  height: 380px; /* Taller scene */
  margin-bottom: var(--space-xl);
  perspective: 1000px;
}

/* 装饰背景层 */
.scene-decor-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.pond {
  position: absolute;
  bottom: 25px;
  right: 15%;
  width: 140px;
  height: 60px;
  background: linear-gradient(180deg, #a2e1fa, #45b7d1);
  -webkit-background-clip: border-box; /* Standard property for compatibility if needed, though usually for text */
  background-clip: border-box;
  border-radius: 50%;
  box-shadow: inset 0 5px 10px rgba(0,0,0,0.1), 0 5px 15px rgba(162, 225, 250, 0.4);
  border: 4px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
}

.water-reflection {
  position: absolute;
  top: 10px;
  left: 15px;
  width: 40px;
  height: 20px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: rotate(-10deg);
}

.duck {
  position: absolute;
  font-size: 20px;
  animation: float-duck 6s ease-in-out infinite alternate;
}

@keyframes float-duck {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(40px, 10px) rotate(5deg); }
  100% { transform: translate(10px, 5px) rotate(-5deg); }
}

.grass-patch {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: radial-gradient(ellipse at center, rgba(143, 218, 154, 0.4) 0%, transparent 80%);
  z-index: -1;
  filter: blur(10px);
}

.dog-house {
  position: absolute;
  bottom: 40px;
  left: 20%;
  transform: translateX(-20%);
  z-index: 10;
  transition: all 0.3s ease;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
}

.dog-house:hover {
  transform: translateX(-20%) scale(1.05) rotate(-2deg);
}

.cottage-roof {
  width: 150px;
  height: 80px;
  background: #e6b89c;
  border-radius: 20px 20px 4px 4px;
  position: relative;
  z-index: 2;
  box-shadow: inset 0 -5px 10px rgba(0,0,0,0.1);
}

.roof-texture {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: linear-gradient(45deg, #8b4513 25%, transparent 25%, transparent 50%, #8b4513 50%, #8b4513 75%, transparent 75%, transparent);
  background-size: 20px 20px;
}

.cottage-body {
  background: #fff8e7;
  width: 120px;
  height: 80px;
  margin: -5px auto 0;
  border-radius: 0 0 12px 12px;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
  border: 2px solid #e6b89c;
}

.house-door {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 55px;
  background: #8b5e3c;
  border-radius: 20px 20px 0 0;
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.2);
}

.house-window {
  position: absolute;
  top: 20px;
  left: 15px;
  width: 24px;
  height: 24px;
  background: #b5eaff;
  border: 4px solid #e6b89c;
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.chimney {
  position: absolute;
  top: -20px;
  right: 25px;
  width: 18px;
  height: 35px;
  background: #cd7f32;
  border-radius: 4px;
}

.smoke {
  position: absolute;
  top: -15px;
  left: 50%;
  width: 12px;
  height: 12px;
  background: rgba(255,255,255,0.8);
  border-radius: 50%;
  animation: float-up 2.5s ease-out infinite;
}

/* 狗狗和互动 */
.dog-character {
  position: absolute;
  bottom: 50px;
  left: 65%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 20;
  transition: transform var(--transition-bounce);
}

.dog-character:hover {
  transform: translateX(-50%) translateY(-5px) scale(1.1);
}

.dog-emoji {
  font-size: 100px;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));
  animation: cute-bounce 3s ease-in-out infinite;
}

.dog-mood-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 5px auto 0;
  border: 2px solid white;
  box-shadow: 0 0 10px currentColor;
}

.dog-status {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  text-align: center;
}

.energy-bar {
  height: 6px;
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 4px;
}

.energy-fill {
  height: 100%;
  background: linear-gradient(90deg, #8fda9a, #4ecdc4);
  border-radius: 10px;
}

.status-text {
  font-size: 10px;
  color: var(--color-text-secondary);
  font-weight: bold;
}

/* 快捷操作区 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-top: -20px; /* Overlap slightly */
  position: relative;
  z-index: 30;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: var(--glass-heavy-bg);
  backdrop-filter: var(--glass-heavy-backdrop);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.action-btn:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 140, 148, 0.2);
  border-color: var(--color-primary-light);
  background: white;
}

.action-btn:active {
  transform: translateY(-4px) scale(0.98);
}

.action-icon {
  font-size: 32px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.action-label {
  font-size: 11px;
  color: var(--color-text-primary);
  font-weight: 700;
}

.highlight-btn {
  background: linear-gradient(135deg, #fff0f5, #fff);
  border: 1px solid var(--color-primary-light);
}

.highlight-btn:hover {
  background: linear-gradient(135deg, #fff, #fff0f5);
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .scene-content {
    padding: var(--space-md);
    padding-bottom: 110px;
  }
  
  .timer-display { font-size: 28px; }
  
  .quick-actions {
    gap: 8px;
  }
  
  .action-btn {
    padding: 12px 4px;
    border-radius: 16px;
  }
  
  .action-icon { font-size: 26px; }
  .action-label { font-size: 10px; transform: scale(0.9); }
  
  .dog-scene { height: 320px; }
  .dog-emoji { font-size: 80px; }
}
</style>
