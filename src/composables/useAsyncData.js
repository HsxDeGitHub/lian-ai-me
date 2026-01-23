import { ref, isRef } from 'vue'

/**
 * 异步数据加载 Composable
 * 管理异步操作的状态（loading, error, data）
 *
 * @param {Function} asyncFn - 异步函数
 * @returns {Object} { data, error, loading, execute, reset }
 */
export function useAsyncData(asyncFn) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  /**
   * 执行异步函数
   * @param {...any} args - 传递给异步函数的参数
   * @returns {Promise} 执行结果
   */
  const execute = async (...args) => {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFn(...args)
      data.value = result
      loading.value = false
      return result
    } catch (err) {
      error.value = err
      loading.value = false
      throw err
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }

  return {
    data,
    error,
    loading,
    execute,
    reset
  }
}

/**
 * 异步获取数据的 Composable
 * 自动加载数据
 *
 * @param {Function} asyncFn - 异步函数
 * @param {*} initialData - 初始数据
 * @returns {Object} { data, error, loading, refresh }
 */
export function useFetch(asyncFn, initialData = null) {
  const data = ref(initialData)
  const error = ref(null)
  const loading = ref(false)

  const fetch = async (...args) => {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFn(...args)
      data.value = result
      loading.value = false
      return result
    } catch (err) {
      error.value = err
      loading.value = false
      throw err
    }
  }

  // 初始加载（如果传入的是 ref，则监听变化）
  if (!isRef(asyncFn)) {
    fetch()
  }

  return {
    data,
    error,
    loading,
    refresh: fetch,
    fetch
  }
}

/**
 * 批量异步加载 Composable
 * 并行执行多个异步操作
 *
 * @param {Array<Function>} asyncFns - 异步函数数组
 * @returns {Object} { results, errors, loading, executeAll }
 */
export function useAsyncAll(asyncFns) {
  const results = ref([])
  const errors = ref([])
  const loading = ref(false)

  const executeAll = async (...args) => {
    loading.value = true
    errors.value = []

    try {
      const promises = asyncFns.map(async (fn, index) => {
        try {
          const result = await fn(...args)
          return { success: true, data: result, index }
        } catch (error) {
          return { success: false, error, index }
        }
      })

      const settled = await Promise.allSettled(promises)
      results.value = settled.map(s => s.value)
      loading.value = false

      // 分类结果
      const successful = results.value.filter(r => r.success)
      const failed = results.value.filter(r => !r.success)

      if (failed.length > 0) {
        errors.value = failed.map(f => f.error)
        console.warn(`[useAsyncAll] ${failed.length}/${asyncFns.length} 个请求失败`)
      }

      return {
        successful,
        failed,
        all: results.value
      }
    } catch (err) {
      loading.value = false
      error.value = err
      throw err
    }
  }

  return {
    results,
    errors,
    loading,
    executeAll
  }
}

/**
 * 防抖异步执行 Composable
 *
 * @param {Function} asyncFn - 异步函数
 * @param {number} delay - 防抖延迟（毫秒）
 * @returns {Object} { data, error, loading, execute }
 */
export function useDebouncedAsync(asyncFn, delay = 300) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  let timeoutId = null

  const execute = (...args) => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      loading.value = true
      error.value = null

      timeoutId = setTimeout(async () => {
        try {
          const result = await asyncFn(...args)
          data.value = result
          loading.value = false
          resolve(result)
        } catch (err) {
          error.value = err
          loading.value = false
          reject(err)
        }
      }, delay)
    })
  }

  return {
    data,
    error,
    loading,
    execute
  }
}
