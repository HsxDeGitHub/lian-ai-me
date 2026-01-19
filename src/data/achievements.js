// 成就数据
export const ACHIEVEMENTS = [
  {
    id: 'first-diary',
    title: '初次记录',
    description: '写下第一篇日记',
    icon: '📖',
    category: 'diary',
    rarity: 'common',
    trigger: {
      type: 'diary_entries',
      condition: { operator: 'gte', value: 1 }
    },
    reward: { bones: 20 }
  },
  {
    id: 'diary-streak-7',
    title: '坚持一周',
    description: '连续7天记录日记',
    icon: '🔥',
    category: 'diary',
    rarity: 'rare',
    trigger: {
      type: 'diary_streak',
      condition: { operator: 'gte', value: 7 }
    },
    reward: { bones: 100 }
  },
  {
    id: 'diary-streak-30',
    title: '坚持一月',
    description: '连续30天记录日记',
    icon: '📆',
    category: 'diary',
    rarity: 'epic',
    trigger: {
      type: 'diary_streak',
      condition: { operator: 'gte', value: 30 }
    },
    reward: { bones: 500 }
  },
  {
    id: 'diary-master',
    title: '日记大师',
    description: '累计写下100篇日记',
    icon: '📚',
    category: 'diary',
    rarity: 'legendary',
    trigger: {
      type: 'diary_entries',
      condition: { operator: 'gte', value: 100 }
    },
    reward: { bones: 500 }
  },
  {
    id: 'single-100-days',
    title: '百日孤独',
    description: '单身满100天',
    icon: '💯',
    category: 'milestone',
    rarity: 'common',
    trigger: {
      type: 'single_days',
      condition: { operator: 'gte', value: 100 }
    },
    reward: { bones: 50 }
  },
  {
    id: 'single-365-days',
    title: '周年纪念',
    description: '单身满365天',
    icon: '🎂',
    category: 'milestone',
    rarity: 'rare',
    trigger: {
      type: 'single_days',
      condition: { operator: 'gte', value: 365 }
    },
    reward: { bones: 200 }
  },
  {
    id: 'single-520-days',
    title: '浪漫数字',
    description: '单身满520天',
    icon: '💕',
    category: 'milestone',
    rarity: 'epic',
    trigger: {
      type: 'single_days',
      condition: { operator: 'gte', value: 520 }
    },
    reward: { bones: 520 }
  },
  {
    id: 'single-1000-days',
    title: '千日独行',
    description: '单身满1000天',
    icon: '🏆',
    category: 'milestone',
    rarity: 'legendary',
    trigger: {
      type: 'single_days',
      condition: { operator: 'gte', value: 1000 }
    },
    reward: { bones: 1000 }
  },
  {
    id: 'task-warrior',
    title: '任务达人',
    description: '完成50个任务',
    icon: '⚔️',
    category: 'tasks',
    rarity: 'rare',
    trigger: {
      type: 'tasks_completed',
      condition: { operator: 'gte', value: 50 }
    },
    reward: { bones: 300 }
  },
  {
    id: 'dog-lover',
    title: '狗狗挚友',
    description: '与狗狗互动100次',
    icon: '🐕',
    category: 'dog',
    rarity: 'common',
    trigger: {
      type: 'dog_interactions',
      condition: { operator: 'gte', value: 100 }
    },
    reward: { bones: 80 }
  },
  {
    id: 'home-upgrade-1',
    title: '温馨小窝',
    description: '将狗屋升级到2级',
    icon: '🏠',
    category: 'home',
    rarity: 'common',
    trigger: {
      type: 'house_level',
      condition: { operator: 'gte', value: 2 }
    },
    reward: { bones: 100 }
  },
  {
    id: 'shopaholic',
    title: '购物达人',
    description: '在商店购买20件商品',
    icon: '🛍️',
    category: 'shop',
    rarity: 'rare',
    trigger: {
      type: 'items_purchased',
      condition: { operator: 'gte', value: 20 }
    },
    reward: { bones: 150 }
  },
  {
    id: 'rich-dog',
    title: '富狗狗',
    description: '累计拥有10000骨头币',
    icon: '💰',
    category: 'currency',
    rarity: 'epic',
    trigger: {
      type: 'total_earned',
      condition: { operator: 'gte', value: 10000 }
    },
    reward: { bones: 500 }
  },
  {
    id: 'social-butterfly',
    title: '社交达人',
    description: '在社区发布10条帖子',
    icon: '🦋',
    category: 'community',
    rarity: 'common',
    trigger: {
      type: 'posts_created',
      condition: { operator: 'gte', value: 10 }
    },
    reward: { bones: 100 }
  }
]
