// 任务数据模板
export const TASK_TEMPLATES = [
  {
    id: 'daily-checkin',
    title: '每日签到',
    description: '每天打开APP记录心情',
    type: 'daily',
    frequency: 'daily',
    reward: 10,
    icon: '📅',
    difficulty: 'easy',
    requiresProof: false
  },
  {
    id: 'diary-entry',
    title: '记录心情',
    description: '写一篇日记，记录今天的感受',
    type: 'daily',
    frequency: 'daily',
    reward: 20,
    icon: '📝',
    difficulty: 'easy',
    requiresProof: false
  },
  {
    id: 'play-with-dog',
    title: '陪伴狗狗',
    description: '和狗狗互动一次',
    type: 'daily',
    frequency: 'daily',
    reward: 15,
    icon: '🐕',
    difficulty: 'easy',
    requiresProof: false
  },
  {
    id: 'exercise',
    title: '运动打卡',
    description: '完成30分钟以上运动',
    type: 'daily',
    frequency: 'daily',
    reward: 30,
    icon: '💪',
    difficulty: 'medium',
    requiresProof: true
  },
  {
    id: 'read-book',
    title: '阅读时光',
    description: '阅读30分钟以上',
    type: 'daily',
    frequency: 'daily',
    reward: 25,
    icon: '📚',
    difficulty: 'medium',
    requiresProof: true
  },
  {
    id: 'meditation',
    title: '冥想放松',
    description: '冥想或放松15分钟',
    type: 'daily',
    frequency: 'daily',
    reward: 20,
    icon: '🧘',
    difficulty: 'easy',
    requiresProof: false
  },
  {
    id: 'learn-skill',
    title: '学习新技能',
    description: '学习一项新技能或课程',
    type: 'weekly',
    frequency: 'weekly',
    reward: 100,
    icon: '🎓',
    difficulty: 'hard',
    requiresProof: true
  },
  {
    id: 'social-activity',
    title: '社交活动',
    description: '参加一次线下社交活动',
    type: 'weekly',
    frequency: 'weekly',
    reward: 150,
    icon: '👥',
    difficulty: 'hard',
    requiresProof: true
  },
  {
    id: 'weekly-diary',
    title: '周记达人',
    description: '一周内写满7篇日记',
    type: 'weekly',
    frequency: 'weekly',
    reward: 80,
    icon: '✍️',
    difficulty: 'medium',
    requiresProof: false
  },
  {
    id: 'milestone-share',
    title: '分享里程碑',
    description: '分享一个单身里程碑到社区',
    type: 'special',
    frequency: 'once',
    reward: 50,
    icon: '🎉',
    difficulty: 'easy',
    requiresProof: false
  },
  {
    id: 'complete-5-tasks',
    title: '任务达人',
    description: '一天内完成5个任务',
    type: 'achievement',
    frequency: 'repeatable',
    reward: 100,
    icon: '⭐',
    difficulty: 'hard',
    requiresProof: false
  }
]
