// 模拟社区帖子数据
export const MOCK_POSTS = [
  {
    id: 'post-1',
    content: '今天跑步5公里，感觉整个人都轻盈了！运动真的能让人开心起来 💪',
    author: '匿名用户',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 23,
    comments: 5,
    isTreeHole: false,
    mood: 'happy'
  },
  {
    id: 'post-2',
    content: '周末一个人去看了电影，虽然有点孤单，但是享受独处的感觉也不错 🎬',
    author: '匿名用户',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 45,
    comments: 12,
    isTreeHole: false,
    mood: 'calm'
  },
  {
    id: 'post-3',
    content: '有时候会想，是不是自己要求太高了？但我不想将就啊...',
    author: '匿名用户',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 67,
    comments: 23,
    isTreeHole: true,
    mood: 'sad'
  },
  {
    id: 'post-4',
    content: '今天学会了做蛋糕！虽然卖相不太好，但是味道还可以 🍰',
    author: '匿名用户',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: 89,
    comments: 15,
    isTreeHole: false,
    mood: 'proud'
  },
  {
    id: 'post-5',
    content: '单身365天了！给自己买了个小礼物庆祝一下 🎁',
    author: '匿名用户',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: 156,
    comments: 34,
    isTreeHole: false,
    mood: 'excited'
  },
  {
    id: 'post-6',
    content: '今天在咖啡店看到一对情侣在吵架，突然觉得单身也挺好的 😂',
    author: '匿名用户',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    likes: 234,
    comments: 45,
    isTreeHole: false,
    mood: 'happy'
  },
  {
    id: 'post-7',
    content: '有时候真的很想有个人可以分享生活，但又害怕打破现在的平静...',
    author: '匿名用户',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    likes: 123,
    comments: 28,
    isTreeHole: true,
    mood: 'bored'
  },
  {
    id: 'post-8',
    content: '完成了一个月的学习计划！虽然很累，但是很充实 📚',
    author: '匿名用户',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    likes: 178,
    comments: 19,
    isTreeHole: false,
    mood: 'proud'
  }
]
