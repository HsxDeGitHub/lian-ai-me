import { ref, watch } from 'vue'
import { saveToStorage, loadFromStorage, removeFromStorage } from '@/utils/helpers'

/**
 * localStorage Composable
 * 响应式的 localStorage 数据绑定
 *
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @param {Object} options - 配置选项
 * @returns {Object} { value, save, remove, isInMemory }
 */
export function useLocalStorage(key, defaultValue, options = {}) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossWindow = true
  } = options

  // 从 storage 加载数据
  const load = () => {
    const data = loadFromStorage(key)
    return data !== null ? data : defaultValue
  }

  // 响应式数据
  const value = ref(load())

  // 保存到 storage
  const save = (newValue) => {
    if (newValue !== undefined) {
      value.value = newValue
    }
    return saveToStorage(key, value.value)
  }

  // 从 storage 删除
  const remove = () => {
    removeFromStorage(key)
    value.value = defaultValue
  }

  // 检查是否在内存存储中
  const isInMemory = () => {
    const { isInMemoryStorage } = require('@/utils/helpers')
    return isInMemoryStorage(key)
  }

  // 监听值变化，自动保存
  watch(
    value,
    (newValue) => {
      saveToStorage(key, newValue)
    },
    { deep: true }
  )

  // 跨窗口同步（storage 事件）
  if (syncAcrossWindow && typeof window !== 'undefined') {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          value.value = deserialize(event.newValue)
        } catch (error) {
          console.error(`[useLocalStorage] 反序列化失败:`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // 清理监听器（通过 onUnmounted 的 composable 使用）
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }

  return {
    value,
    save,
    remove,
    isInMemory
  }
}

/**
 * SessionStorage Composable
 * 类似 useLocalStorage，但使用 sessionStorage
 *
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {Object} { value, save, remove }
 */
export function useSessionStorage(key, defaultValue) {
  const value = ref(defaultValue)

  const load = () => {
    try {
      const data = sessionStorage.getItem(key)
      return data !== null ? JSON.parse(data) : defaultValue
    } catch (error) {
      console.error(`[useSessionStorage] 读取失败:`, error)
      return defaultValue
    }
  }

  const save = (newValue) => {
    if (newValue !== undefined) {
      value.value = newValue
    }
    try {
      sessionStorage.setItem(key, JSON.stringify(value.value))
      return true
    } catch (error) {
      console.error(`[useSessionStorage] 保存失败:`, error)
      return false
    }
  }

  const remove = () => {
    try {
      sessionStorage.removeItem(key)
      value.value = defaultValue
      return true
    } catch (error) {
      console.error(`[useSessionStorage] 删除失败:`, error)
      return false
    }
  }

  // 初始加载
  value.value = load()

  return {
    value,
    save,
    remove
  }
}
