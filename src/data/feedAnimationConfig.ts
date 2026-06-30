import type { FeedAnimationId, FeedCycleAnimationId, PlayCycleAnimationId } from '../types'

export const feedAnimationOrder: FeedCycleAnimationId[] = [
  'cat-food',
  'canned-food',
  'milk',
  'fish-snack',
]

export const playAnimationOrder: PlayCycleAnimationId[] = ['yarn-ball', 'feather-wand']

export const feedAnimationStatusText: Record<FeedAnimationId, string> = {
  'cat-food': '正在吃猫粮',
  'canned-food': '正在吃棒棒糖',
  milk: '正在喝牛奶',
  'fish-snack': '正在吃小鱼干',
  'body-wash': '正在洗香香',
  'yarn-ball': '正在玩毛线球',
  'feather-wand': '正在玩魔法棒',
}
