import type { CSSProperties } from 'react'

const fireworkBursts = [
  { accent: '#ffd166', color: '#ff7b72', delay: '0s', left: '12%', size: 128, top: '18%' },
  { accent: '#9bf6ff', color: '#58a6ff', delay: '0.35s', left: '28%', size: 144, top: '28%' },
  { accent: '#f8c8ff', color: '#c084fc', delay: '0.7s', left: '50%', size: 156, top: '16%' },
  { accent: '#fff3a3', color: '#ffb703', delay: '1.05s', left: '70%', size: 134, top: '30%' },
  { accent: '#caffbf', color: '#22c55e', delay: '1.4s', left: '86%', size: 148, top: '20%' },
  { accent: '#ffd6a5', color: '#fb7185', delay: '1.75s', left: '18%', size: 140, top: '52%' },
  { accent: '#cde7ff', color: '#60a5fa', delay: '2.1s', left: '44%', size: 132, top: '46%' },
  { accent: '#fbcfe8', color: '#ec4899', delay: '2.45s', left: '74%', size: 150, top: '54%' },
] as const

const sparkRotations = [0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336]

type LevelUpCelebrationProps = {
  level: number
}

const buildBurstStyle = (burst: (typeof fireworkBursts)[number]) =>
  ({
    '--burst-accent': burst.accent,
    '--burst-color': burst.color,
    '--burst-delay': burst.delay,
    '--burst-left': burst.left,
    '--burst-size': `${burst.size}px`,
    '--burst-top': burst.top,
  }) as CSSProperties

const buildSparkStyle = (rotation: number) =>
  ({
    '--spark-rotation': `${rotation}deg`,
  }) as CSSProperties

export const LevelUpCelebration = ({ level }: LevelUpCelebrationProps) => (
  <div className="level-up-celebration" aria-hidden="true">
    <div className="level-up-celebration__veil" />
    <div className="level-up-celebration__headline">
      <span>升级庆祝</span>
      <strong>Lv.{level}</strong>
      <p>小猫又长大一点啦</p>
    </div>

    {fireworkBursts.map((burst, burstIndex) => (
      <span className="firework-burst" key={`${burst.left}-${burst.top}`} style={buildBurstStyle(burst)}>
        <span className="firework-burst__trail" />
        <span className="firework-burst__core" />
        {sparkRotations.map((rotation) => (
          <span
            className="firework-burst__spark"
            key={`${burstIndex}-${rotation}`}
            style={buildSparkStyle(rotation)}
          />
        ))}
      </span>
    ))}
  </div>
)
