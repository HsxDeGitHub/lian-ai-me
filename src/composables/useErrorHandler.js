import { ref, computed } from 'vue'
import { errorHandler } from '@/utils/errorHandler'

/**
 * 错误处理 Composable
 * 提供统一的错误处理接口
 *
 * @returns {Object} { error, setError, clearError, withError, catchAsync }
 */
export function useErrorHandler() {
  const error = ref(null)
  const errors = ref([])

  /**
   * 设置错误
   * @param {Error|string} err - 错误对象或消息
   * @param {Object} context - 错误上下文
   */
  const setError = (err, context = {}) => {
    const errorObj = err instanceof Error ? err : new Error(err)
    error.value = errorObj

    // 记录到全局错误处理器
    errorHandler.log(errorObj, context)

    // 添加到错误列表
    errors.value.push(errorObj)

    // 限制错误列表大小
    if (errors.value.length > 10) {
      errors.value.shift()
    }

    return errorObj
  }

  /**
   * 清除错误
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * 清除所有错误
   */
  const clearAllErrors = () => {
    error.value = null
    errors.value = []
  }

  /**
   * 包装异步函数，自动捕获错误
   * @param {Function} fn - 异步函数
   * @param {Object} context - 错误上下文
   * @returns {Function} 包装后的函数
   */
  const withError = (fn, context = {}) => {
    return async (...args) => {
      clearError()
      try {
        return await fn(...args)
      } catch (err) {
        setError(err, context)
        throw err
      }
    }
  }

  /**
   * 捕获异步错误但不抛出
   * @param {Function} fn - 异步函数
   * @param {Object} context - 错误上下文
   * @returns {Promise|null}
   */
  const catchAsync = async (fn, context = {}) => {
    clearError()
    try {
      return await fn()
    } catch (err) {
      setError(err, context)
      return null
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
    return error.value?.message || ''
  })

  return {
    error,
    errors,
    hasError,
    errorMessage,
    setError,
    clearError,
    clearAllErrors,
    withError,
    catchAsync
  }
}

/**
 * 重试逻辑 Composable
 * 失败后自动重试
 *
 * @param {Function} fn - 要重试的函数
 * @param {Object} options - 配置选项
 * @returns {Object} { execute, retry, reset, state }
 */
export function useRetry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 2, // 指数退避倍数
    onRetry = null
  } = options

  const state = ref({
    attempts: 0,
    lastError: null,
    isRetrying: false
  })

  const { setError, clearError } = useErrorHandler()

  /**
   * 执行函数（带重试）
   * @param {...any} args - 函数参数
   * @returns {Promise} 执行结果
   */
  const execute = async (...args) => {
    clearError()
    state.value.attempts = 0
    state.value.lastError = null
    state.value.isRetrying = true

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      state.value.attempts = attempt

      try {
        const result = await fn(...args)
        state.value.isRetrying = false
        return result
      } catch (error) {
        state.value.lastError = error

        if (attempt === maxAttempts) {
          state.value.isRetrying = false
          setError(error, { attempt, maxAttempts })
          throw error
        }

        // 计算延迟时间（指数退避）
        const currentDelay = delay * Math.pow(backoff, attempt - 1)

        if (onRetry) {
          onRetry(attempt, error, currentDelay)
        }

        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, currentDelay))
      }
    }
  }

  /**
   * 重试（使用之前的参数）
   */
  const retry = () => {
    return execute()
  }

  /**
   * 重置状态
   */
  const reset = () => {
    state.value = {
      attempts: 0,
      lastError: null,
      isRetrying: false
    }
    clearError()
  }

  return {
    execute,
    retry,
    reset,
    state
  }
}

/**
 * 表单验证错误 Composable
 *
 * @param {Object} rules - 验证规则 { field: (value) => boolean | string }
 * @returns {Object} { validate, validateField, errors, clearErrors }
 */
export function useFormValidation(rules = {}) {
  const errors = ref({})

  /**
   * 验证单个字段
   * @param {string} field - 字段名
   * @param {*} value - 字段值
   * @returns {boolean} 是否有效
   */
  const validateField = (field, value) => {
    const rule = rules[field]
    if (!rule) return true

    const result = rule(value)

    if (result === true) {
      delete errors.value[field]
      return true
    } else {
      errors.value[field] = typeof result === 'string' ? result : '验证失败'
      return false
    }
  }

  /**
   * 验证所有字段
   * @param {Object} data - 数据对象
   * @returns {boolean} 是否全部有效
   */
  const validate = (data) => {
    let isValid = true

    for (const field in rules) {
      const fieldValid = validateField(field, data[field])
      if (!fieldValid) {
        isValid = false
      }
    }

    return isValid
  }

  /**
   * 清除所有错误
   */
  const clearErrors = () => {
    errors.value = {}
  }

  /**
   * 清除单个字段错误
   * @param {string} field - 字段名
   */
  const clearFieldError = (field) => {
    delete errors.value[field]
  }

  /**
   * 是否有错误
   */
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  return {
    errors,
    hasErrors,
    validate,
    validateField,
    clearErrors,
    clearFieldError
  }
}
