import { ref, onUnmounted } from 'vue'

/**
 * 定时器 Composable
 * 自动清理定时器，避免内存泄漏
 *
 * @param {Function} callback - 定时器回调函数
 * @param {number} delay - 定时器间隔（毫秒）
 * @returns {Object} { isActive, start, stop, restart }
 */
export function useTimer(callback, delay = 1000) {
  const timerId = ref(null)
  const isActive = ref(false)

  const start = () => {
    if (isActive.value) return

    isActive.value = true
    timerId.value = setInterval(callback, delay)
  }

  const stop = () => {
    if (!timerId.value) return

    clearInterval(timerId.value)
    timerId.value = null
    isActive.value = false
  }

  const restart = () => {
    stop()
    start()
  }

  // 组件卸载时自动清理
  onUnmounted(() => {
    stop()
  })

  return {
    isActive,
    start,
    stop,
    restart
  }
}

/**
 * 延迟执行 Composable
 * setTimeout 的封装，自动清理
 *
 * @param {Function} callback - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Object} { clear, isPending }
 */
export function useTimeout(callback, delay = 0) {
  const timeoutId = ref(null)
  const isPending = ref(false)

  const start = () => {
    if (isPending.value) return

    isPending.value = true
    timeoutId.value = setTimeout(() => {
      callback()
      isPending.value = false
      timeoutId.value = null
    }, delay)
  }

  const clear = () => {
    if (!timeoutId.value) return

    clearTimeout(timeoutId.value)
    timeoutId.value = null
    isPending.value = false
  }

  onUnmounted(() => {
    clear()
  })

  return {
    isPending,
    start,
    clear
  }
}
