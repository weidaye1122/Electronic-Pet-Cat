import { levelRules } from '../data/levelRules'
import type { GrowthStage, LevelRule } from '../types'

export const growthStages: GrowthStage[] = [
  { id: 'baby', name: '小奶猫', minLevel: 1, maxLevel: 3, description: '圆圆软软，最喜欢被照顾。' },
  { id: 'spark', name: '活力小猫', minLevel: 4, maxLevel: 7, description: '开始蹦蹦跳跳，充满小小好奇心。' },
  { id: 'smart', name: '聪明小猫', minLevel: 8, maxLevel: 12, description: '学会更多本领，也更会表达开心。' },
  { id: 'adventure', name: '冒险小猫', minLevel: 13, maxLevel: 15, description: '准备探索更大的世界，解锁更多房间。' },
  { id: 'glow', name: '闪耀小猫', minLevel: 16, maxLevel: 18, description: '变得更自信也更会打扮，开始散发小明星光芒。' },
  { id: 'star', name: '明星小猫', minLevel: 19, maxLevel: 99, description: '闪闪发光，是最会成长的小猫。' },
]

export const calculateLevelFromGrowth = (
  growthValue: number,
  rules: LevelRule[] = levelRules,
) => {
  let currentLevel = rules[0]?.level ?? 1

  for (const rule of rules) {
    if (growthValue >= rule.needGrowth) {
      currentLevel = rule.level
    }
  }

  return currentLevel
}

export const getLevelRule = (level: number, rules: LevelRule[] = levelRules) =>
  rules.find((rule) => rule.level === level)

export const getNextLevelRule = (level: number, rules: LevelRule[] = levelRules) =>
  rules.find((rule) => rule.level === level + 1)

export const getStageForLevel = (level: number) =>
  growthStages.find((stage) => level >= stage.minLevel && level <= stage.maxLevel) ?? growthStages[0]

export const getGrowthProgress = (
  growthValue: number,
  level: number,
  rules: LevelRule[] = levelRules,
) => {
  const currentRule = getLevelRule(level, rules) ?? rules[0]
  const nextRule = getNextLevelRule(level, rules)

  if (!nextRule || !currentRule) {
    return {
      percentage: 100,
      currentBase: currentRule?.needGrowth ?? 0,
      nextTarget: currentRule?.needGrowth ?? growthValue,
      remaining: 0,
    }
  }

  const span = nextRule.needGrowth - currentRule.needGrowth
  const current = growthValue - currentRule.needGrowth

  return {
    percentage: Math.max(0, Math.min(100, Math.round((current / span) * 100))),
    currentBase: currentRule.needGrowth,
    nextTarget: nextRule.needGrowth,
    remaining: Math.max(0, nextRule.needGrowth - growthValue),
  }
}
