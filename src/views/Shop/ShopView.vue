<template>
  <div class="shop-view">
    <div class="shop-header">
      <div class="currency-display">
        <span class="coin-icon">🦴</span>
        <span class="coin-amount">{{ currencyStore.balance }}</span>
      </div>
      <h1 class="shop-title">汪汪市集</h1>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <button
        v-for="category in shopStore.categories"
        :key="category.id"
        @click="selectCategory(category.id)"
        class="category-tab"
        :class="{ active: shopStore.selectedCategory === category.id }"
      >
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-name">{{ category.name }}</span>
      </button>
    </div>

    <!-- 商品列表 -->
    <div class="items-grid">
      <div
        v-for="item in currentCategoryItems"
        :key="item.id"
        class="item-card"
        :class="getQualityClass(item.rarity)"
      >
        <div class="item-icon">{{ item.icon }}</div>
        <div class="item-info">
          <h3 class="item-name">{{ item.name }}</h3>
          <p class="item-description">{{ item.description }}</p>
          <div class="item-price">
            <span class="price-icon">🦴</span>
            <span class="price-amount">{{ item.price }}</span>
          </div>
        </div>
        <button
          @click="purchaseItem(item)"
          class="purchase-btn"
          :class="{ owned: shopStore.isItemOwned(item.id) }"
          :disabled="shopStore.isItemOwned(item.id)"
        >
          {{ shopStore.isItemOwned(item.id) ? '已拥有' : '购买' }}
        </button>
      </div>
    </div>

    <!-- 底部导航 -->
    <TabBar />
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
  return `quality-${rarity}`
}

const purchaseItem = async (item) => {
  try {
    await shopStore.purchaseItem(item.id)
    alert(`成功购买 ${item.name}！`)
  } catch (error) {
    alert(error.message)
  }
}
</script>

<style scoped>
.shop-view {
  min-height: 100vh;
  padding: var(--space-lg);
  padding-bottom: 100px;
  background: var(--color-bg-primary);
}

.shop-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.currency-display {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-bg-card);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
}

.coin-icon {
  font-size: var(--font-xl);
}

.coin-amount {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--color-primary);
}

.shop-title {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  overflow-x: auto;
  padding-bottom: var(--space-sm);
}

.category-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.category-tab:hover {
  border-color: var(--color-primary);
}

.category-tab.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.category-tab.active .category-name {
  color: white;
}

.category-icon {
  font-size: var(--font-2xl);
}

.category-name {
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
}

/* 商品列表 */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-md);
}

.item-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  transition: all var(--transition-base);
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.item-card.quality-common {
  border-color: var(--quality-common);
}

.item-card.quality-rare {
  border-color: var(--quality-rare);
}

.item-card.quality-epic {
  border-color: var(--quality-epic);
}

.item-card.quality-legendary {
  border-color: var(--quality-legendary);
}

.item-icon {
  font-size: var(--font-4xl);
  text-align: center;
  margin-bottom: var(--space-md);
}

.item-info {
  margin-bottom: var(--space-md);
}

.item-name {
  font-size: var(--font-md);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xs);
}

.item-description {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.item-price {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.price-icon {
  font-size: var(--font-md);
}

.price-amount {
  font-size: var(--font-md);
  font-weight: var(--font-bold);
  color: var(--color-primary);
}

.purchase-btn {
  width: 100%;
  padding: var(--space-sm);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.purchase-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.purchase-btn:disabled {
  background: var(--color-border);
  color: var(--color-text-secondary);
  cursor: not-allowed;
}
</style>
