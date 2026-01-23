import { ref, computed } from 'vue'

/**
 * 加载状态管理 Composable
 * 统一管理异步操作的加载状态
 *
 * @param {boolean} initialState - 初始状态
 * @returns {Object} { loading, error, setLoading, setError, execute, withLoading }
 */
export function useLoading(initialState = false) {
  const loading = ref(initialState)
  const error = ref(null)

  /**
   * 设置加载状态
   * @param {boolean} state - 加载状态
   */
  const setLoading = (state) => {
    loading.value = state
  }

  /**
   * 设置错误
   * @param {Error|string|null} err - 错误对象或消息
   */
  const setError = (err) => {
    error.value = err
    loading.value = false
  }

  /**
   * 执行异步函数（自动管理加载状态）
   * @param {Function} asyncFn - 异步函数
   * @returns {Promise} 执行结果
   */
  const execute = async (asyncFn) => {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFn()
      loading.value = false
      return result
    } catch (err) {
      error.value = err
      loading.value = false
      throw err
    }
  }

  /**
   * 包装函数，自动添加加载状态
   * @param {Function} fn - 要包装的函数
   * @returns {Function} 包装后的函数
   */
  const withLoading = (fn) => {
    return async (...args) => {
      return execute(() => fn(...args))
    }
  }

  /**
   * 是否有错误
   */
  const hasError = computed(() => error.value !== null)

  /**
   * 错误消息
   */
  const errorMessage = computed(() => {
    if (!error.value) return ''
    return error.value instanceof Error ? error.value.message : String(error.value)
  })

  return {
    loading,
    error,
    hasError,
    errorMessage,
    setLoading,
    setError,
    execute,
    withLoading
  }
}

/**
 * 全局加载状态
 * 用于管理整个应用的加载状态
 */
export const globalLoading = ref(false)
export const globalError = ref(null)

/**
 * 设置全局加载状态
 * @param {boolean} state - 加载状态
 */
export function setGlobalLoading(state) {
  globalLoading.value = state
}

/**
 * 设置全局错误
 * @param {Error|string|null} err - 错误对象或消息
 */
export function setGlobalError(err) {
  globalError.value = err
  if (err) {
    globalLoading.value = false
  }
}

/**
 * 多个加载状态的合并 Composable
 * 用于同时管理多个异步操作的状态
 *
 * @param {Object} loadingStates - 加载状态对象 { task1: false, task2: true }
 * @returns {Object} { loadingStates, anyLoading, allLoading, setLoading, reset }
 */
export function useMultipleLoadings(initialStates = {}) {
  const loadingStates = ref({ ...initialStates })

  /**
   * 是否有任一任务在加载
   */
  const anyLoading = computed(() => {
    return Object.values(loadingStates.value).some(v => v === true)
  })

  /**
   * 是否所有任务都在加载
   */
  const allLoading = computed(() => {
    const values = Object.values(loadingStates.value)
    return values.length > 0 && values.every(v => v === true)
  })

  /**
   * 已完成的任务数
   */
  const completedCount = computed(() => {
    return Object.values(loadingStates.value).filter(v => v === false).length
  })

  /**
   * 总任务数
   */
  const totalCount = computed(() => {
    return Object.keys(loadingStates.value).length
  })

  /**
   * 进度百分比
   */
  const progress = computed(() => {
    if (totalCount.value === 0) return 0
    return (completedCount.value / totalCount.value) * 100
  })

  /**
   * 设置特定任务的加载状态
   * @param {string} key - 任务键
   * @param {boolean} state - 加载状态
   */
  const setLoading = (key, state) => {
    loadingStates.value[key] = state
  }

  /**
   * 重置所有状态
   */
  const reset = () => {
    Object.keys(loadingStates.value).forEach(key => {
      loadingStates.value[key] = false
    })
  }

  return {
    loadingStates,
    anyLoading,
    allLoading,
    completedCount,
    totalCount,
    progress,
    setLoading,
    reset
  }
}

/**
 * 分页加载 Composable
 * 管理分页数据的加载状态
 *
 * @param {Function} fetchFn - 获取数据的函数
 * @param {Object} options - 配置选项
 * @returns {Object} { data, loading, error, loadMore, refresh, hasMore, page }
 */
export function usePagination(fetchFn, options = {}) {
  const { pageSize = 20, initialPage = 1 } = options

  const data = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(initialPage)
  const hasMore = ref(true)

  /**
   * 加载数据
   * @param {number} pageNum - 页码（追加或替换）
   * @param {boolean} append - 是否追加数据
   */
  const load = async (pageNum, append = false) => {
    loading.value = true
    error.value = null

    try {
      const result = await fetchFn(pageNum, pageSize)

      if (append) {
        data.value = [...data.value, ...result]
      } else {
        data.value = result
      }

      hasMore.value = result.length === pageSize
      page.value = pageNum
      loading.value = false

      return result
    } catch (err) {
      error.value = err
      loading.value = false
      throw err
    }
  }

  /**
   * 加载更多（追加）
   */
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return
    return load(page.value + 1, true)
  }

  /**
   * 刷新（替换）
   */
  const refresh = async () => {
    return load(initialPage, false)
  }

  return {
    data,
    loading,
    error,
    page,
    hasMore,
    load,
    loadMore,
    refresh
  }
}
