import { useEffect, useEffectEvent, useState } from 'react'
import { SLEEP_DURATION_MS } from '../data/petTimings'
import type { FeedAnimationId, Pet } from '../types'

type PetCardProps = {
  feedAnimationQueue?: FeedAnimationId[]
  hatIcon?: string
  onFeedAnimationComplete?: () => void
  pet: Pet
  scarfIcon?: string
  sleepEndAt?: number
  shoesIcon?: string
}

type MotionStep = {
  duration: number
  source: string
}

const frameSorter = new Intl.Collator('zh-Hans-CN', { numeric: true, sensitivity: 'base' })

const sortFrameSources = (frames: Record<string, string>) =>
  Object.entries(frames)
    .sort(([frameA], [frameB]) => frameSorter.compare(frameA, frameB))
    .map(([, source]) => source)

const createHoldSteps = (source: string | undefined, count: number, duration: number) =>
  source ? Array.from({ length: count }, () => ({ duration, source })) : []

const createClipSteps = (
  sources: string[],
  duration: number,
  options?: {
    leadHold?: number
    trailHold?: number
  },
): MotionStep[] => {
  if (!sources.length) {
    return []
  }

  const firstFrame = sources[0]
  const lastFrame = sources.at(-1)

  return [
    ...createHoldSteps(firstFrame, options?.leadHold ?? 0, duration),
    ...sources.map((source) => ({ duration, source })),
    ...createHoldSteps(lastFrame, options?.trailHold ?? 0, duration),
  ]
}

const blinkTailFrameSources = sortFrameSources(
  import.meta.glob('../../图片/01眨眼睛甩尾巴/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const sleepFrameSources = sortFrameSources(
  import.meta.glob('../../图片/02 趴着睡觉/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const lickPawFrameSources = sortFrameSources(
  import.meta.glob('../../图片/03 舔爪子/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const catFoodFrameSources = sortFrameSources(
  import.meta.glob('../../图片/05 吃猫粮/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const candyFrameSources = sortFrameSources(
  import.meta.glob('../../图片/06 吃棒棒糖/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const milkFrameSources = sortFrameSources(
  import.meta.glob('../../图片/07 喝牛奶/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const fishSnackFrameSources = sortFrameSources(
  import.meta.glob('../../图片/08 吃小鱼干/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const bodyWashFrameSources = sortFrameSources(
  import.meta.glob('../../图片/11 洗一洗/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const yarnBallFrameSources = sortFrameSources(
  import.meta.glob('../../图片/09玩毛线球/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const featherWandFrameSources = sortFrameSources(
  import.meta.glob('../../图片/10魔法棒/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

const blinkTailMotionSteps = createClipSteps(blinkTailFrameSources, 110, { leadHold: 10 })
const lickPawMotionSteps = createClipSteps(lickPawFrameSources, 185, {
  leadHold: 1,
  trailHold: 3,
})
const sleepMotionSteps = createClipSteps(sleepFrameSources, 176)
const defaultMotionSteps = [
  ...blinkTailMotionSteps,
  ...blinkTailMotionSteps,
  ...lickPawMotionSteps,
]

const feedMotionStepsById: Record<FeedAnimationId, MotionStep[]> = {
  'cat-food': createClipSteps(catFoodFrameSources, 125, { leadHold: 1, trailHold: 2 }),
  'canned-food': createClipSteps(candyFrameSources, 135, { leadHold: 1, trailHold: 2 }),
  milk: createClipSteps(milkFrameSources, 130, { leadHold: 1, trailHold: 2 }),
  'fish-snack': createClipSteps(fishSnackFrameSources, 125, { leadHold: 1, trailHold: 2 }),
  'body-wash': createClipSteps(bodyWashFrameSources, 140, { leadHold: 1, trailHold: 2 }),
  'yarn-ball': createClipSteps(yarnBallFrameSources, 130, { leadHold: 1, trailHold: 2 }),
  'feather-wand': createClipSteps(featherWandFrameSources, 130, { leadHold: 1, trailHold: 2 }),
}

const feedFallbackFrameById: Record<FeedAnimationId, string | undefined> = {
  'cat-food': catFoodFrameSources.at(-1) ?? catFoodFrameSources[0],
  'canned-food': candyFrameSources.at(-1) ?? candyFrameSources[0],
  milk: milkFrameSources.at(-1) ?? milkFrameSources[0],
  'fish-snack': fishSnackFrameSources.at(-1) ?? fishSnackFrameSources[0],
  'body-wash': bodyWashFrameSources.at(-1) ?? bodyWashFrameSources[0],
  'yarn-ball': yarnBallFrameSources.at(-1) ?? yarnBallFrameSources[0],
  'feather-wand': featherWandFrameSources.at(-1) ?? featherWandFrameSources[0],
}

const getMotionStepAtElapsed = (steps: MotionStep[], elapsed: number) => {
  if (!steps.length) {
    return null
  }

  let remainingElapsed = Math.max(0, elapsed)

  for (const [index, step] of steps.entries()) {
    if (remainingElapsed < step.duration) {
      return {
        index,
        remaining: step.duration - remainingElapsed,
      }
    }

    remainingElapsed -= step.duration
  }

  return {
    index: steps.length - 1,
    remaining: null,
  }
}

const AnimatedPetArt = ({
  feedAnimationQueue = [],
  onFeedAnimationComplete,
  sleepEndAt,
}: Pick<PetCardProps, 'feedAnimationQueue' | 'onFeedAnimationComplete' | 'sleepEndAt'>) => {
  const isSleeping = Boolean(sleepEndAt && sleepEndAt > Date.now())
  const [defaultPlaybackIndex, setDefaultPlaybackIndex] = useState(0)
  const [sleepPlaybackIndex, setSleepPlaybackIndex] = useState(0)
  const [feedPlaybackIndex, setFeedPlaybackIndex] = useState(0)
  const [completedFeedToken, setCompletedFeedToken] = useState('')
  const [preparedFeedToken, setPreparedFeedToken] = useState('')

  const activeFeedAnimationId = !isSleeping ? feedAnimationQueue[0] : undefined
  const activeFeedSteps = activeFeedAnimationId ? feedMotionStepsById[activeFeedAnimationId] : []
  const activeFeedToken = activeFeedAnimationId ? feedAnimationQueue.join('|') : ''

  const advanceDefaultFrame = useEffectEvent(() => {
    setDefaultPlaybackIndex((currentFrame) => (currentFrame + 1) % defaultMotionSteps.length)
  })

  const finishFeedAnimation = useEffectEvent(() => {
    if (!activeFeedToken) {
      return
    }

    setCompletedFeedToken(activeFeedToken)
    onFeedAnimationComplete?.()
  })

  useEffect(() => {
    if (isSleeping && sleepEndAt) {
      const activeSleepStep = getMotionStepAtElapsed(
        sleepMotionSteps,
        Date.now() - (sleepEndAt - SLEEP_DURATION_MS),
      )

      setSleepPlaybackIndex(activeSleepStep?.index ?? 0)
      return
    }

    setSleepPlaybackIndex(0)
    setDefaultPlaybackIndex(0)
  }, [isSleeping, sleepEndAt])

  useEffect(() => {
    setFeedPlaybackIndex(0)
    setCompletedFeedToken('')
    setPreparedFeedToken(activeFeedToken)
  }, [activeFeedToken])

  useEffect(() => {
    if (isSleeping || activeFeedAnimationId) {
      setDefaultPlaybackIndex(0)
    }
  }, [activeFeedAnimationId, isSleeping])

  useEffect(() => {
    if (isSleeping || activeFeedAnimationId || defaultMotionSteps.length < 2) {
      return
    }

    const currentDefaultStep = defaultMotionSteps[defaultPlaybackIndex] ?? defaultMotionSteps[0]

    if (!currentDefaultStep) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      advanceDefaultFrame()
    }, currentDefaultStep.duration)

    return () => window.clearTimeout(timeoutId)
  }, [activeFeedAnimationId, advanceDefaultFrame, defaultPlaybackIndex, isSleeping])

  useEffect(() => {
    if (!isSleeping || !sleepEndAt || sleepMotionSteps.length < 2) {
      return
    }

    const activeSleepStep = getMotionStepAtElapsed(
      sleepMotionSteps,
      Date.now() - (sleepEndAt - SLEEP_DURATION_MS),
    )

    if (!activeSleepStep) {
      return
    }

    if (activeSleepStep.index !== sleepPlaybackIndex) {
      setSleepPlaybackIndex(activeSleepStep.index)
      return
    }

    if (activeSleepStep.remaining == null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSleepPlaybackIndex((currentFrame) =>
        Math.min(currentFrame + 1, sleepMotionSteps.length - 1),
      )
    }, activeSleepStep.remaining)

    return () => window.clearTimeout(timeoutId)
  }, [isSleeping, sleepEndAt, sleepPlaybackIndex])

  useEffect(() => {
    if (
      isSleeping ||
      !activeFeedAnimationId ||
      preparedFeedToken !== activeFeedToken ||
      completedFeedToken === activeFeedToken
    ) {
      return
    }

    if (!activeFeedSteps.length) {
      finishFeedAnimation()
      return
    }

    const currentFeedStep = activeFeedSteps[feedPlaybackIndex] ?? activeFeedSteps.at(-1)

    if (!currentFeedStep) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      if (feedPlaybackIndex >= activeFeedSteps.length - 1) {
        finishFeedAnimation()
        return
      }

      setFeedPlaybackIndex((currentFrame) =>
        Math.min(currentFrame + 1, activeFeedSteps.length - 1),
      )
    }, currentFeedStep.duration)

    return () => window.clearTimeout(timeoutId)
  }, [
    activeFeedAnimationId,
    activeFeedSteps,
    activeFeedToken,
    completedFeedToken,
    feedPlaybackIndex,
    finishFeedAnimation,
    isSleeping,
    preparedFeedToken,
  ])

  const currentFrame = isSleeping
    ? sleepMotionSteps[sleepPlaybackIndex]?.source ??
      sleepFrameSources.at(-1) ??
      sleepFrameSources[0]
    : activeFeedAnimationId
      ? activeFeedSteps[feedPlaybackIndex]?.source ??
        feedFallbackFrameById[activeFeedAnimationId] ??
        defaultMotionSteps[0]?.source
      : defaultMotionSteps[defaultPlaybackIndex]?.source ?? defaultMotionSteps[0]?.source
  const frameClassName = `pet-avatar__frame${
    activeFeedAnimationId === 'body-wash' ? ' pet-avatar__frame--wash' : ''
  }`

  if (!currentFrame) {
    return <span className="pet-avatar__empty">动作帧还没接入</span>
  }

  return (
    <div className="pet-avatar__motion" aria-hidden="true">
      <img alt="" className={frameClassName} draggable="false" src={currentFrame} />
    </div>
  )
}

export const PetCard = ({
  feedAnimationQueue = [],
  hatIcon,
  onFeedAnimationComplete,
  pet,
  scarfIcon,
  sleepEndAt,
  shoesIcon,
}: PetCardProps) => {
  return (
    <section className={`pet-card pet-card--${pet.currentBackground || 'default'}`}>
      <div className="pet-avatar" aria-label={`${pet.name} 的小猫形象`} role="img">
        {hatIcon ? (
          <span className="pet-avatar__hat" aria-hidden="true">
            {hatIcon}
          </span>
        ) : null}
        {scarfIcon ? (
          <span className="pet-avatar__scarf" aria-hidden="true">
            {scarfIcon}
          </span>
        ) : null}
        {shoesIcon ? (
          <span className="pet-avatar__shoes" aria-hidden="true">
            {shoesIcon}
          </span>
        ) : null}
        <span className="pet-avatar__ground" aria-hidden="true" />
        <div className="pet-avatar__scene">
          <AnimatedPetArt
            feedAnimationQueue={feedAnimationQueue}
            onFeedAnimationComplete={onFeedAnimationComplete}
            sleepEndAt={sleepEndAt}
          />
        </div>
        <span className="pet-avatar__shadow" />
      </div>
    </section>
  )
}
