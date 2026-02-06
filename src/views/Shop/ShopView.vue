<template>
  <div class="shop-page">
    <!-- 顶部导航 -->
    <header class="page-header" role="banner">
      <div class="currency-card" aria-label="骨头币余额">
        <span class="coin-icon" aria-hidden="true">🦴</span>
        <span class="coin-amount">{{ currencyStore.balance }}</span>
      </div>
      <h1 class="shop-title">🛒 汪汪市集</h1>
      <div class="header-spacer" aria-hidden="true"></div>
    </header>

    <!-- 分类标签 -->
    <nav class="category-tabs" aria-label="商品分类">
      <div role="tablist" class="category-list">
        <button
          v-for="category in shopStore.categories"
          :key="category.id"
          @click="selectCategory(category.id)"
          class="category-chip"
          :class="{ active: shopStore.selectedCategory === category.id }"
          role="tab"
          :aria-selected="shopStore.selectedCategory === category.id"
          :aria-label="`${category.name}分类，${getCategoryItemCount(category.id)}件商品`"
        >
          <span class="chip-icon" aria-hidden="true">{{ category.icon }}</span>
          <span class="chip-name">{{ category.name }}</span>
        </button>
      </div>
    </nav>

    <!-- 商品网格 -->
    <main class="items-section" role="main" :aria-label="`${getCurrentCategoryName()}商品列表`">
      <div class="items-grid" role="list">
        <article
          v-for="item in currentCategoryItems"
          :key="item.id"
          class="shop-item-card"
          :class="[
            getQualityClass(item.rarity),
            { owned: shopStore.isItemOwned(item.id) }
          ]"
          role="listitem"
          :aria-label="`${item.name}，${item.description}，${getRarityLabel(item.rarity)}品质，${item.price}骨头币${shopStore.isItemOwned(item.id) ? '，已拥有' : ''}`"
        >
          <!-- 物品图标区域 -->
          <div class="item-display" aria-hidden="true">
            <div class="item-icon-wrapper">
              <span class="item-emoji">{{ item.icon }}</span>
              <!-- 稀有度光效 -->
              <div v-if="item.rarity === 'legendary'" class="rarity-glow legendary"></div>
              <div v-else-if="item.rarity === 'epic'" class="rarity-glow epic"></div>
              <div v-else-if="item.rarity === 'rare'" class="rarity-glow rare"></div>
            </div>
            <!-- 已拥有标签 -->
            <div v-if="shopStore.isItemOwned(item.id)" class="owned-badge" aria-label="已拥有">
              <span>✓</span>
            </div>
          </div>

          <!-- 物品信息 -->
          <div class="item-details">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-desc">{{ item.description }}</p>

            <!-- 价格和购买按钮 -->
            <div class="item-action">
              <div class="price-tag" aria-label="价格">
                <span class="price-icon" aria-hidden="true">🦴</span>
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                @click="purchaseItem(item)"
                class="buy-btn"
                :class="{ owned: shopStore.isItemOwned(item.id) }"
                :disabled="shopStore.isItemOwned(item.id)"
                :aria-label="`${shopStore.isItemOwned(item.id) ? '已拥有' : '购买'}${item.name}`"
              >
                <span v-if="!shopStore.isItemOwned(item.id)">购买</span>
                <span v-else>已拥有</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>

    <!-- 底部导航占位 -->
    <div class="tab-bar-spacer"></div>
    <div class="tab-bar-wrapper">
      <TabBar />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TabBar from '@/views/Home/components/TabBar.vue'
import { useCurrencyStore } from '@/stores/currency'
import { useShopStore } from '@/stores/shop'

const currencyStore = useCurrencyStore()
const shopStore = useShopStore()

const currentCategoryItems = computed(() => {
  return shopStore.itemsByCategory(shopStore.selectedCategory)
})

const selectCategory = (categoryId) => {
  shopStore.selectCategory(categoryId)
}

const getQualityClass = (rarity) => {
  return `quality-${rarity || 'common'}`
}

const getRarityLabel = (rarity) => {
  const labels = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return labels[rarity] || '普通'
}

const getCurrentCategoryName = () => {
  const category = shopStore.categories.find(c => c.id === shopStore.selectedCategory)
  return category?.name || '全部'
}

const getCategoryItemCount = (categoryId) => {
  return shopStore.itemsByCategory(categoryId).length
}

const purchaseItem = async (item) => {
  if (shopStore.isItemOwned(item.id)) return

  try {
    await shopStore.purchaseItem(item.id)
    // 使用现代化的toast通知
    if (window.$toast) {
      window.$toast.success(`成功购买 ${item.name}！`, {
        title: '🎉 购买成功'
      })
    }
  } catch (error) {
    if (window.$toast) {
      window.$toast.error(error.message, {
        title: '❌ 购买失败'
      })
    }
  }
}
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  padding: var(--space-lg);
  padding-bottom: 120px;
  max-width: 800px;
  margin: 0 auto;
}

/* ========== 顶部导航 ========== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  padding: 12px 20px;
  background: var(--glass-heavy-bg);
  backdrop-filter: var(--glass-heavy-backdrop);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
  position: sticky;
  top: var(--space-md);
  z-index: 100;
  transition: all 0.3s ease;
}

.page-header:hover {
  box-shadow: var(--shadow-glass);
  transform: translateY(-2px);
}

.currency-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, rgba(255, 140, 148, 0.1), rgba(255, 182, 193, 0.1));
  border-radius: var(--radius-full);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid rgba(255, 140, 148, 0.2);
}

.coin-icon {
  font-size: 20px;
  animation: coin-bounce 2s ease-in-out infinite;
}

@keyframes coin-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(10deg); }
}

.coin-amount {
  font-size: var(--font-md);
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shop-title {
  font-size: var(--font-lg);
  font-weight: 800;
  margin: 0;
  background: var(--gradient-rainbow);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.header-spacer {
  width: 60px; /* Balance the layout */
}

/* ========== 分类标签 ========== */
.category-tabs {
  margin-bottom: var(--space-xl);
}

.category-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.category-list::-webkit-scrollbar {
  display: none;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-bounce);
  white-space: nowrap;
  scroll-snap-align: start;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}

.category-chip:hover {
  transform: translateY(-2px);
  background: white;
  box-shadow: 0 6px 15px rgba(255, 140, 148, 0.2);
  color: var(--color-primary);
}

.category-chip.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: 0 6px 20px rgba(255, 140, 148, 0.4);
  transform: translateY(-2px) scale(1.05);
}

.chip-icon {
  font-size: 16px;
}

/* ========== 商品网格 ========== */
.items-section {
  margin-bottom: var(--space-xl);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-md);
}

.shop-item-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  border-radius: 20px;
  padding: 12px;
  box-shadow: var(--shadow-sm);
  border: var(--glass-border);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.shop-item-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  z-index: 1;
}

.shop-item-card.owned {
  opacity: 0.8;
}

/* 稀有度边框样式 */
.shop-item-card.quality-common { border-color: rgba(189, 195, 199, 0.5); }
.shop-item-card.quality-rare { border-color: rgba(129, 212, 250, 0.5); background: linear-gradient(160deg, rgba(255,255,255,0.9), rgba(225, 245, 254, 0.6)); }
.shop-item-card.quality-epic { border-color: rgba(206, 147, 216, 0.5); background: linear-gradient(160deg, rgba(255,255,255,0.9), rgba(243, 229, 245, 0.6)); }
.shop-item-card.quality-legendary { border-color: rgba(255, 213, 79, 0.6); background: linear-gradient(160deg, rgba(255,255,255,0.9), rgba(255, 253, 231, 0.6)); }

/* 物品展示区 */
.item-display {
  position: relative;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background: radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0.2));
  border-radius: 16px;
  overflow: hidden;
}

.item-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-emoji {
  font-size: 56px;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1));
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.shop-item-card:hover .item-emoji {
  transform: scale(1.2) rotate(10deg);
}

/* 稀有度光效 */
.rarity-glow {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  filter: blur(20px);
}

.shop-item-card:hover .rarity-glow { opacity: 0.6; }
.rarity-glow.rare { background: #81d4fa; }
.rarity-glow.epic { background: #ce93d8; }
.rarity-glow.legendary { background: #ffe082; opacity: 0.4; animation: rotate-glow 4s linear infinite; }

@keyframes rotate-glow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 已拥有标签 */
.owned-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: var(--gradient-secondary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 2;
}

/* 物品信息 */
.item-details { flex: 1; display: flex; flex-direction: column; }

.item-name {
  font-size: var(--font-md);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.item-desc {
  font-size: 11px;
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
  line-height: 1.4;
  height: 32px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* Standard property */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 购买区域 */
.item-action {
  margin-top: auto;
  display: flex;
  gap: 8px;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: rgba(255, 140, 148, 0.1);
  border-radius: 12px;
}

.price-value {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-primary-dark);
}

.buy-btn {
  flex: 1;
  padding: 8px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(255, 140, 148, 0.3);
}

.buy-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 140, 148, 0.4);
}

.buy-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.buy-btn:disabled {
  background: #f0f0f0;
  color: #bbb;
  box-shadow: none;
  cursor: default;
}

/* 底部导航 */
.tab-bar-spacer { height: 20px; }
.tab-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  pointer-events: none; /* Let clicks pass through to container */
}
.tab-bar-wrapper > * { pointer-events: auto; }

/* ========== 移动端适配 ========== */
@media (max-width: 480px) {
  .shop-page {
    padding: var(--space-md);
    padding-bottom: 120px;
  }
  
  .page-header {
    margin-bottom: 16px;
    padding: 8px 16px;
  }
  
  .shop-title { font-size: 18px; }
  .header-spacer { width: 0; display: none; }
  
  .items-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .shop-item-card { padding: 10px; border-radius: 16px; }
  .item-display { height: 80px; margin-bottom: 8px; }
  .item-emoji { font-size: 40px; }
  .item-name { font-size: 13px; }
  .item-desc { font-size: 10px; margin-bottom: 8px; }
}
</style>
