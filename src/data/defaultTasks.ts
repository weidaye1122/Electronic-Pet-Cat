import type { Task } from '../types'

export const defaultTasks: Task[] = [
  {
    id: 'bag-clean',
    title: '整理书包',
    icon: '🎒',
    points: 10,
    growth: 5,
    status: 'todo',
  },
  {
    id: 'brush-teeth',
    title: '按时刷牙',
    icon: '🪥',
    points: 10,
    growth: 5,
    status: 'todo',
  },
  {
    id: 'say-thanks',
    title: '讲礼貌',
    icon: '🙌',
    points: 10,
    growth: 5,
    status: 'todo',
  },
]
