<template>
  <div class="room-decorator-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <button @click="goBack" class="header-btn back">
        <span class="btn-icon">←</span>
        <span>返回</span>
      </button>
      <h1 class="page-title">🏠 我的小屋</h1>
      <button
        @click="toggleEditMode"
        class="header-btn edit"
        :class="{ active: roomStore.editingMode }"
      >
        <span class="btn-icon">{{ roomStore.editingMode ? '✓' : '✎' }}</span>
        <span>{{ roomStore.editingMode ? '完成' : '编辑' }}</span>
      </button>
    </div>

    <!-- 小屋画布 -->
    <div class="canvas-section">
      <HouseCanvas />

      <!-- 物品统计 -->
      <div class="item-stats">
        <div class="stat-item">
          <span class="stat-icon">🪑</span>
          <span class="stat-value">{{ roomStore.placedItems.length }}</span>
          <span class="stat-label">已放置</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📦</span>
          <span class="stat-value">{{ roomStore.unplacedFurniture.length }}</span>
          <span class="stat-label">仓库</span>
        </div>
      </div>
    </div>

    <!-- 物品仓库 (编辑模式显示) -->
    <div v-if="roomStore.editingMode" class="inventory-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon">📦</span>
          物品仓库
        </h2>
        <span class="section-count">{{ roomStore.unplacedFurniture.length }} 件</span>
      </div>

      <!-- 区域筛选 -->
      <div class="zone-filter">
        <button
          v-for="zone in zoneList"
          :key="zone.id"
          @click="filterByZone(zone.id)"
          class="filter-chip"
          :class="{ active: filterZone === zone.id }"
        >
          <span>{{ zone.icon }}</span>
          <span>{{ zone.name }}</span>
        </button>
      </div>

      <!-- 物品列表 -->
      <div class="inventory-grid">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="inventory-card"
          :class="getQualityClass(item.rarity)"
          @click="placeItem(item)"
        >
          <div class="card-inner">
            <span class="item-emoji">{{ item.icon }}</span>
            <span class="item-name">{{ item.name }}</span>
          </div>
          <div class="add-badge">
            <span>+</span>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredItems.length === 0" class="empty-state">
          <div class="empty-icon">🛒</div>
          <p>这个区域还没有物品哦</p>
          <p class="empty-hint">去商店逛逛吧~</p>
        </div>
      </div>

      <!-- 全部空状态 -->
      <div v-if="roomStore.unplacedFurniture.length === 0" class="empty-all">
        <div class="empty-icon">🏠</div>
        <p>仓库是空的</p>
        <button @click="goToShop" class="shop-btn">
          <span>🛒</span>
          <span>去商店</span>
        </button>
      </div>
    </div>

    <!-- 浏览模式提示 -->
    <div v-else-if="roomStore.placedItems.length === 0" class="welcome-hint">
      <div class="hint-card">
        <div class="hint-icon">💡</div>
        <h3>开始布置你的小屋</h3>
        <p>在商店购买家具后，点击右上角的"编辑"按钮开始布置</p>
      </div>
    </div>

    <!-- 底部安全区 -->
    <div class="safe-area-bottom"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomStore } from '@/stores/room'
import { getZoneList } from '@/data/houseZones'
import HouseCanvas from './components/HouseCanvas.vue'

const router = useRouter()
const roomStore = useRoomStore()

const zoneList = computed(() => getZoneList())
const filterZone = ref('all')

// 筛选后的物品列表
const filteredItems = computed(() => {
  if (filterZone.value === 'all') {
    return roomStore.unplacedFurniture
  }
  return roomStore.unplacedFurniture.filter(item => item.placementZone === filterZone.value)
})

// 按区域筛选
const filterByZone = (zoneId) => {
  filterZone.value = filterZone.value === zoneId ? 'all' : zoneId
}

// 切换编辑模式
const toggleEditMode = () => {
  roomStore.toggleEditMode()
  if (!roomStore.editingMode) {
    // 退出编辑模式时自动保存
    roomStore.saveRoom()
  }
}

// 放置物品
const placeItem = (item) => {
  roomStore.placeItem(item, roomStore.selectedZone)
}

// 获取稀有度样式类
const getQualityClass = (rarity) => {
  return `quality-${rarity || 'common'}`
}

// 返回首页
const goBack = () => {
  if (roomStore.editingMode) {
    roomStore.toggleEditMode()
    roomStore.saveRoom()
  }
  router.push('/')
}

// 去商店
const goToShop = () => {
  router.push('/shop')
}

// 初始化
onMounted(() => {
  roomStore.initRoom()
})
</script>

<style scoped>
.room-decorator-page {
  min-height: 100vh;
  background: var(--gradient-modern-bg);
  padding: var(--space-lg);
  padding-bottom: 120px;
  position: relative;
  overflow-x: hidden;
}

/* ========== 顶部导航 ========== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding: 0 4px;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--glass-heavy-bg);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: var(--shadow-sm);
}

.header-btn:hover {
  transform: translateY(-2px);
  background: white;
  box-shadow: var(--shadow-md);
  color: var(--color-primary);
}

.header-btn:active {
  transform: scale(0.95);
}

.header-btn.edit.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(255, 140, 148, 0.4);
}

.btn-icon {
  font-size: 16px;
}

.page-title {
  flex: 1;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  background: var(--gradient-rainbow);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: 1px;
}

/* ========== 画布区域 ========== */
.canvas-section {
  margin-bottom: var(--space-lg);
  position: relative;
  z-index: 10;
}

.item-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: scale(1.05);
  background: white;
}

.stat-icon {
  font-size: 18px;
}

.stat-value {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 600;
  text-transform: uppercase;
}

/* ========== 仓库区域 ========== */
.inventory-section {
  background: var(--glass-heavy-bg);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 24px;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.05);
  margin-bottom: var(--space-md);
  border: var(--glass-border);
  animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slide-up {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
}

.title-icon {
  font-size: 24px;
}

.section-count {
  padding: 4px 12px;
  background: var(--gradient-secondary);
  color: white;
  font-size: 11px;
  font-weight: 800;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* 区域筛选 */
.zone-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding: 4px;
  scrollbar-width: none;
}

.zone-filter::-webkit-scrollbar { display: none; }

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-chip:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.filter-chip.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(255, 140, 148, 0.4);
  transform: scale(1.05);
}

/* 物品网格 */
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 16px;
  max-height: 320px;
  overflow-y: auto;
  padding: 4px;
}

.inventory-card {
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 10px;
  background: rgba(255,255,255,0.6);
  border: 2px solid transparent;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.inventory-card:hover .card-inner {
  transform: translateY(-4px);
  background: white;
  box-shadow: var(--shadow-md);
}

.add-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: var(--gradient-secondary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 5;
}

.inventory-card:hover .add-badge {
  opacity: 1;
  transform: scale(1);
}

.item-emoji {
  font-size: 40px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.item-name {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.2;
}

/* 稀有度样式 */
.inventory-card.quality-common .card-inner { border-color: rgba(0,0,0,0.05); }
.inventory-card.quality-rare .card-inner { border-color: #81d4fa; background: linear-gradient(145deg, rgba(225, 245, 254, 0.5), rgba(255,255,255,0.8)); }
.inventory-card.quality-epic .card-inner { border-color: #ce93d8; background: linear-gradient(145deg, rgba(243, 229, 245, 0.5), rgba(255,255,255,0.8)); }
.inventory-card.quality-legendary .card-inner { border-color: #ffd54f; background: linear-gradient(145deg, rgba(255, 253, 231, 0.5), rgba(255,255,255,0.8)); }

/* 空状态 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--color-text-secondary);
  background: rgba(255,255,255,0.4);
  border-radius: 24px;
  border: 2px dashed rgba(0,0,0,0.05);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 4px 0;
  font-size: 14px;
}

.empty-hint {
  font-size: 12px !important;
  color: var(--color-text-light);
}

.empty-all {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
}

.shop-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px 24px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 15px rgba(255, 140, 148, 0.3);
}

.shop-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 140, 148, 0.5);
}

/* ========== 欢迎提示 ========== */
.welcome-hint {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  animation: fade-in 1s ease;
}

.hint-card {
  text-align: center;
  padding: 40px;
  background: var(--glass-heavy-bg);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  border: 1px solid rgba(255,255,255,0.6);
}

.hint-icon {
  font-size: 64px;
  margin-bottom: 24px;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
  animation: float-icon 3s ease-in-out infinite;
}

@keyframes float-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hint-card h3 {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.hint-card p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* ========== 底部安全区 ========== */
.safe-area-bottom {
  height: 40px;
}

/* ========== 移动端适配 ========== */
@media (max-width: 480px) {
  .room-decorator-page {
    padding: 16px;
    padding-bottom: 100px;
  }

  .inventory-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
  }

  .item-emoji { font-size: 32px; }
  .item-name { font-size: 10px; }
  
  .section-title { font-size: 16px; }
  .title-icon { font-size: 20px; }
}
</style>
