export type InteractionFeedbackKind =
  | 'button'
  | 'careAction'
  | 'cat'
  | 'error'
  | 'inventoryUse'
  | 'longPress'
  | 'password'
  | 'success'

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

type VibrationNavigator = Navigator & {
  vibrate?: (pattern: number[]) => boolean
}

const feedbackKinds = new Set<InteractionFeedbackKind>([
  'button',
  'careAction',
  'cat',
  'error',
  'inventoryUse',
  'longPress',
  'password',
  'success',
])

const vibrationPatterns: Record<InteractionFeedbackKind, number | number[]> = {
  button: 8,
  careAction: [10, 24, 10],
  cat: [12, 32, 18],
  error: [30, 35, 30],
  inventoryUse: [14, 28, 14],
  longPress: [24, 34, 34],
  password: 12,
  success: [10, 22, 14],
}

let audioContext: AudioContext | null = null

export const isInteractionFeedbackKind = (value: string | undefined): value is InteractionFeedbackKind =>
  Boolean(value && feedbackKinds.has(value as InteractionFeedbackKind))

const getAudioContext = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const AudioContextConstructor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext

  if (!AudioContextConstructor) {
    return null
  }

  audioContext ??= new AudioContextConstructor()
  return audioContext
}

const vibrate = (kind: InteractionFeedbackKind) => {
  if (typeof navigator === 'undefined') {
    return
  }

  const vibration = (navigator as VibrationNavigator).vibrate

  if (typeof vibration === 'function') {
    const pattern = vibrationPatterns[kind]

    vibration.call(navigator, Array.isArray(pattern) ? pattern : [pattern])
  }
}

const playTone = (
  context: AudioContext,
  startAt: number,
  frequency: number,
  duration: number,
  peakVolume: number,
  type: OscillatorType = 'sine',
  endFrequency = frequency,
) => {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const endAt = startAt + duration

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, startAt)

  if (endFrequency !== frequency) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), endAt)
  }

  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(peakVolume, startAt + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, endAt)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(startAt)
  oscillator.stop(endAt + 0.025)
}

const playFeedbackSound = (kind: InteractionFeedbackKind, context: AudioContext) => {
  const now = context.currentTime + 0.012

  if (kind === 'password') {
    playTone(context, now, 860, 0.055, 0.034, 'sine', 1180)
    return
  }

  if (kind === 'careAction') {
    playTone(context, now, 420, 0.075, 0.035, 'triangle', 560)
    playTone(context, now + 0.07, 610, 0.09, 0.028, 'sine', 720)
    return
  }

  if (kind === 'inventoryUse') {
    playTone(context, now, 300, 0.06, 0.036, 'triangle', 420)
    playTone(context, now + 0.055, 760, 0.095, 0.03, 'sine', 620)
    return
  }

  if (kind === 'longPress') {
    playTone(context, now, 360, 0.08, 0.038, 'triangle', 520)
    playTone(context, now + 0.075, 700, 0.12, 0.032, 'sine', 560)
    return
  }

  if (kind === 'cat') {
    playTone(context, now, 720, 0.18, 0.05, 'sine', 460)
    playTone(context, now + 0.105, 520, 0.18, 0.044, 'sine', 760)
    playTone(context, now + 0.025, 930, 0.12, 0.012, 'triangle', 690)
    return
  }

  if (kind === 'success') {
    playTone(context, now, 620, 0.075, 0.034, 'sine', 830)
    playTone(context, now + 0.08, 980, 0.12, 0.032, 'triangle', 1180)
    return
  }

  if (kind === 'error') {
    playTone(context, now, 190, 0.13, 0.04, 'sawtooth', 150)
    playTone(context, now + 0.09, 170, 0.12, 0.028, 'sawtooth', 135)
    return
  }

  playTone(context, now, 520, 0.045, 0.03, 'triangle', 650)
}

export const playInteractionFeedback = (kind: InteractionFeedbackKind = 'button') => {
  vibrate(kind)

  const context = getAudioContext()

  if (!context) {
    return
  }

  const play = () => {
    try {
      playFeedbackSound(kind, context)
    } catch {
      audioContext = null
    }
  }

  if (context.state === 'suspended') {
    void context.resume().then(play).catch(() => undefined)
    return
  }

  play()
}
