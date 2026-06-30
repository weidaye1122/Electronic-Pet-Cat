import type { AppMeta } from '../types'

export const createDefaultMeta = (): AppMeta => {
  const now = Date.now()

  return {
    lastActiveDate: '',
    lastLoginRewardDate: '',
    lastTaskRefreshDate: '',
    streakCount: 0,
    profileAvatar: '',
    sleepEndAt: 0,
    lastHungerDecayAt: now,
    lastCleanDecayAt: now,
    lastEnergyDecayAt: now,
    lastPlayAt: now,
    lastPlayPenaltyStage: 0,
    lastLowHungerMoodDecayAt: now,
    lastLowCleanMoodDecayAt: now,
    feedAnimationQueue: [],
    lastFeedCycleItemId: '',
    lastPlayCycleItemId: '',
  }
}
