import { onUnmounted } from 'vue'

/**
 * 事件监听器管理 Composable
 * 自动清理事件监听器，避免内存泄漏
 *
 * @returns {Object} { add, remove, removeAll }
 */
export function useEventListeners() {
  const listeners = new Map()

  /**
   * 添加事件监听器
   * @param {EventTarget} target - 事件目标
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   * @param {Object|boolean} options - 事件选项
   */
  function add(target, event, handler, options = false) {
    if (!target || !event || !handler) {
      console.warn('[useEventListeners] Invalid parameters:', { target, event, handler })
      return
    }

    target.addEventListener(event, handler, options)

    // 生成唯一键
    const key = `${target}_${event}_${handler.name || 'anonymous'}`
    listeners.set(key, { target, event, handler, options })
  }

  /**
   * 移除事件监听器
   * @param {EventTarget} target - 事件目标
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  function remove(target, event, handler) {
    const key = `${target}_${event}_${handler.name || 'anonymous'}`

    if (listeners.has(key)) {
      const { target: t, event: e, handler: h, options } = listeners.get(key)
      t.removeEventListener(e, h, options)
      listeners.delete(key)
    } else {
      // 如果不在 Map 中，尝试直接移除
      target.removeEventListener(event, handler)
    }
  }

  /**
   * 移除所有事件监听器
   */
  function removeAll() {
    listeners.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options)
    })
    listeners.clear()
  }

  // 组件卸载时自动清理所有监听器
  onUnmounted(() => {
    removeAll()
  })

  return {
    add,
    remove,
    removeAll,
    get count() {
      return listeners.size
    }
  }
}

/**
 * 窗口事件监听 Composable
 * 专门用于监听 window 事件
 *
 * @returns {Object} { on, off, removeAll }
 */
export function useWindowEvents() {
  const { add, remove, removeAll } = useEventListeners()

  const on = (event, handler, options) => {
    add(window, event, handler, options)
  }

  const off = (event, handler) => {
    remove(window, event, handler)
  }

  return {
    on,
    off,
    removeAll
  }
}

/**
 * 文档事件监听 Composable
 * 专门用于监听 document 事件
 *
 * @returns {Object} { on, off, removeAll }
 */
export function useDocumentEvents() {
  const { add, remove, removeAll } = useEventListeners()

  const on = (event, handler, options) => {
    add(document, event, handler, options)
  }

  const off = (event, handler) => {
    remove(document, event, handler)
  }

  return {
    on,
    off,
    removeAll
  }
}

/**
 * 键盘事件 Composable
 * 监听键盘快捷键
 *
 * @param {Object} keyMap - 键盘映射 { 'KeyK': () => {} }
 * @param {Object} options - 配置选项
 * @returns {Object} { isActive, enable, disable }
 */
export function useKeyboard(keyMap = {}, options = {}) {
  const { target = window, capture = false } = options
  const { add, remove, removeAll } = useEventListeners()

  const isActive = ref(true)

  const handleKeyDown = (event) => {
    if (!isActive.value) return

    const key = event.code || event.key
    const handler = keyMap[key]

    if (typeof handler === 'function') {
      handler(event)
    }
  }

  const enable = () => {
    isActive.value = true
  }

  const disable = () => {
    isActive.value = false
  }

  // 添加键盘监听
  add(target, 'keydown', handleKeyDown, capture)

  return {
    isActive,
    enable,
    disable
  }
}
