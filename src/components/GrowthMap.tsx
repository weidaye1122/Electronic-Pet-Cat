import type { GrowthStage, LevelRule } from '../types'

type GrowthMapProps = {
  stages: GrowthStage[]
  currentLevel: number
  currentGrowth: number
  rules: LevelRule[]
}

export const GrowthMap = ({
  stages,
  currentLevel,
  currentGrowth,
  rules,
}: GrowthMapProps) => (
  <section className="growth-map">
    {stages.map((stage) => {
      const active = currentLevel >= stage.minLevel && currentLevel <= stage.maxLevel
      const stageRule = rules.find((rule) => rule.level === stage.minLevel)

      return (
        <article className={`growth-stage-card ${active ? 'growth-stage-card--active' : ''}`} key={stage.id}>
          <div className="growth-stage-card__body">
            <strong>{stage.name}</strong>
            <p>{stage.description}</p>
            <small>解锁起点成长值：{stageRule?.needGrowth ?? currentGrowth}</small>
          </div>
          <div className="growth-stage-card__meta">
            <span className="growth-stage-card__range">
              Lv.{stage.minLevel}
              {stage.maxLevel >= 99 ? '+' : ` - Lv.${stage.maxLevel}`}
            </span>
          </div>
        </article>
      )
    })}
  </section>
)
