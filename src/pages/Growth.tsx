import { GrowthMap } from '../components/GrowthMap'
import { levelRules } from '../data/levelRules'
import { usePetStore } from '../hooks/usePetStore'
import { growthStages } from '../utils/level'

export const Growth = () => {
  const { pet, meta, taskStats, growthProgress, nextLevelRule, pointRecords } = usePetStore()

  return (
    <div className="page-stack page-stack--growth">
      <section className="panel growth-panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">成长地图</p>
            <h2>{pet.name} 正在一步一步变得更闪亮</h2>
          </div>
        </div>

        <div className="growth-summary growth-summary--map">
          <article className="metric-card metric-card--stage">
            <span>当前阶段</span>
            <strong>{pet.stage}</strong>
            <small>Lv.{pet.level}</small>
          </article>
          <article className="metric-card metric-card--growth">
            <span>成长值</span>
            <strong>{pet.growthValue}</strong>
            <small>
              {nextLevelRule ? `下一站 Lv.${nextLevelRule.level}` : '已到当前最高等级'}
            </small>
          </article>
          <article className="metric-card metric-card--progress">
            <span>升级进度</span>
            <strong>{growthProgress.percentage}%</strong>
            <small>
              {nextLevelRule ? `还差 ${growthProgress.remaining} 点成长值` : '已经满满当当'}
            </small>
          </article>
          <article className="metric-card metric-card--companion">
            <span>连续陪伴</span>
            <strong>{meta.streakCount} 天</strong>
            <small>今天已领取 {taskStats.claimed} 个任务奖励</small>
          </article>
        </div>

        <GrowthMap currentGrowth={pet.growthValue} currentLevel={pet.level} rules={levelRules} stages={growthStages} />
      </section>

      <section className="panel growth-panel growth-panel--records">
        <div className="panel__header">
          <div>
            <p className="eyebrow">积分记录</p>
            <h2>最近的小小成就</h2>
          </div>
        </div>
        {pointRecords.length === 0 ? (
          <div className="empty-card">
            <strong>还没有积分记录</strong>
            <p>先去完成一个任务，很快就会看到成长的足迹啦。</p>
          </div>
        ) : (
          <div className="history-list history-list--grid">
            {pointRecords.map((record) => (
              <article className="history-item" key={record.id}>
                <div>
                  <strong>{record.title}</strong>
                  <small>{new Date(record.createdAt).toLocaleString('zh-CN')}</small>
                </div>
                <span className={record.change >= 0 ? 'history-item__gain' : 'history-item__loss'}>
                  {record.change >= 0 ? `+${record.change}` : record.change}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
