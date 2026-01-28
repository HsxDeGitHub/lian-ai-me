/**
 * 可访问性工具函数
 * 提供统一的 ARIA 属性和键盘导航支持
 */

/**
 * 生成唯一的 ID
 */
let idCounter = 0
export function generateAriaId(prefix = 'aria') {
  return `${prefix}-${idCounter++}`
}

/**
 * ARIA 属性映射表
 */
export const AriaRoles = {
  BUTTON: 'button',
  LINK: 'link',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  DIALOG: 'dialog',
  ALERT: 'alert',
  ALERTDIALOG: 'alertdialog',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  TABLIST: 'tablist',
  LISTBOX: 'listbox',
  OPTION: 'option',
  COMBOBOX: 'combobox',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SWITCH: 'switch',
  SLIDER: 'slider',
  SPINBUTTON: 'spinbutton',
  SEARCH: 'search',
  FORM: 'form',
  LABEL: 'label',
  ARTICLE: 'article',
  SECTION: 'section',
  ASIDE: 'aside',
  HEADER: 'banner',
  FOOTER: 'contentinfo',
  MAIN: 'main'
}

export const AriaProperties = {
  // 状态属性
  DISABLED: 'aria-disabled',
  READONLY: 'aria-readonly',
  REQUIRED: 'aria-required',
  INVALID: 'aria-invalid',
  EXPANDED: 'aria-expanded',
  CHECKED: 'aria-checked',
  PRESSED: 'aria-pressed',
  SELECTED: 'aria-selected',
  HIDDEN: 'aria-hidden',
  BUSY: 'aria-busy',
  LIVE: 'aria-live',
  ATOMIC: 'aria-atomic',
  RELEVANT: 'aria-relevant',

  // 关系属性
  CONTROLS: 'aria-controls',
  DESCRIBEDBY: 'aria-describedby',
  DETAILS: 'aria-details',
  ERROR: 'aria-error',
  FLOWTO: 'aria-flowto',
  HASPOPUP: 'aria-haspopup',
  LABEL: 'aria-label',
  LABELLEDBY: 'aria-labelledby',
  LEVEL: 'aria-level',
  ORIENTATION: 'aria-orientation',
  OWNS: 'aria-owns',
  POSINSET: 'aria-posinset',
  SETSIZE: 'aria-setsize',
  VALUEMIN: 'aria-valuemin',
  ARIAMAX: 'aria-valuemax',
  ARIANOW: 'aria-valuenow',
  ARIATEXT: 'aria-valuetext',
  LIVE_REGION: 'aria-live',
  ATOMIC: 'aria-atomic'
}

export const AriaLiveRegions = {
  OFF: 'off',
  POLITE: 'polite',
  ASSERTIVE: 'assertive'
}

/**
 * 为元素设置 ARIA 属性
 */
export function setAriaAttributes(element, attributes) {
  if (!element) return

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      element.removeAttribute(key)
    } else if (typeof value === 'boolean') {
      if (value) {
        element.setAttribute(key, 'true')
      } else {
        element.removeAttribute(key)
      }
    } else {
      element.setAttribute(key, String(value))
    }
  })
}

/**
 * 创建可访问的按钮
 */
export function makeAccessibleButton(element, options = {}) {
  const {
    label,
    description,
    pressed,
    expanded,
    disabled,
    controls
  } = options

  const attrs = {}

  if (label) attrs[AriaProperties.LABEL] = label
  if (description) attrs[AriaProperties.DESCRIBEDBY] = description
  if (pressed !== undefined) attrs[AriaProperties.PRESSED] = pressed
  if (expanded !== undefined) attrs[AriaProperties.EXPANDED] = expanded
  if (disabled !== undefined) attrs[AriaProperties.DISABLED] = disabled
  if (controls) attrs[AriaProperties.CONTROLS] = controls

  setAriaAttributes(element, attrs)
}

/**
 * 键盘导航管理器
 */
export class KeyboardNavigation {
  constructor() {
    this.focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable=""]'
    ]
  }

  /**
   * 获取所有可聚焦元素
   */
  getFocusableElements(container = document) {
    return Array.from(container.querySelectorAll(this.focusableSelectors.join(', ')))
  }

  /**
   * 获取第一个可聚焦元素
   */
  getFirstFocusable(container = document) {
    const elements = this.getFocusableElements(container)
    return elements[0] || null
  }

  /**
   * 获取最后一个可聚焦元素
   */
  getLastFocusable(container = document) {
    const elements = this.getFocusableElements(container)
    return elements[elements.length - 1] || null
  }

  /**
   * 聚焦到指定索引的元素
   */
  focusByIndex(container, index) {
    const elements = this.getFocusableElements(container)
    if (index >= 0 && index < elements.length) {
      elements[index].focus()
      return true
    }
    return false
  }

  /**
   * 焦点陷阱（用于模态框）
   */
  trapFocus(container) {
    const handleTabKey = (event) => {
      if (event.key !== 'Tab') return

      const elements = this.getFocusableElements(container)
      if (elements.length === 0) return

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    // 返回清理函数
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  /**
   * 保存和恢复焦点
   */
  saveFocus() {
    this.savedFocusElement = document.activeElement
    return this.savedFocusElement
  }

  restoreFocus() {
    if (this.savedFocusElement && typeof this.savedFocusElement.focus === 'function') {
      this.savedFocusElement.focus()
    }
  }
}

/**
 * 全局键盘导航实例
 */
export const keyboardNav = new KeyboardNavigation()

/**
 * 屏幕阅读器通知
 */
export function announceToScreenReader(message, priority = 'polite') {
  // 创建一个临时的 live region
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.overflow = 'hidden'

  document.body.appendChild(announcement)
  announcement.textContent = message

  // 延迟移除，确保屏幕阅读器读取到
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * 检查颜色对比度（WCAG 标准）
 */
export function checkColorContrast(foreground, background) {
  // 计算相对亮度
  function getLuminance(hex) {
    const rgb = hexToRgb(hex)
    const [r, g, b] = rgb.map(value => {
      value = value / 255
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
    })
    return r * 0.2126 + g * 0.7152 + b * 0.0722
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0]
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  const contrastRatio = (lighter + 0.05) / (darker + 0.05)

  return {
    ratio: contrastRatio,
    wcagAA: contrastRatio >= 4.5, // 正常文本
    wcagAAA: contrastRatio >= 7,   // 大文本
    wcagAALarge: contrastRatio >= 3  // 大文本（18pt+ 或 14pt+ 粗体）
  }
}
