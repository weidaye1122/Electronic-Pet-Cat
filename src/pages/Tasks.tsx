import { useState } from 'react'
import type { FormEvent } from 'react'
import { TaskCard } from '../components/TaskCard'
import { usePetStore } from '../hooks/usePetStore'

export const Tasks = () => {
  const { tasks, taskStats, markTaskDone, claimTaskReward, addCustomTask } = usePetStore()
  const [showCreator, setShowCreator] = useState(false)
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('✨')
  const [points, setPoints] = useState('10')
  const [growth, setGrowth] = useState('5')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    addCustomTask({
      title,
      icon,
      points: Number(points),
      growth: Number(growth),
    })

    if (title.trim()) {
      setTitle('')
      setIcon('✨')
      setPoints('10')
      setGrowth('5')
      setShowCreator(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">今日任务</p>
            <h2>完成任务后，奖励会自动收进来</h2>
          </div>
          <div className="preview-strip">
            <span className="chip">已完成 {taskStats.done}/{taskStats.total}</span>
          </div>
        </div>
        <div className="card-grid card-grid--quad">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              onClaim={() => claimTaskReward(task.id)}
              onComplete={() => markTaskDone(task.id)}
              task={task}
            />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">自定义任务</p>
            <h2>把你自己的任务和奖励也加进来</h2>
          </div>
          <button
            className="ghost-button"
            onClick={() => setShowCreator((current) => !current)}
            type="button"
          >
            {showCreator ? '先收起来' : '添加自定义任务'}
          </button>
        </div>

        {showCreator ? (
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field">
                <span>任务名称</span>
                <input
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="比如：整理玩具"
                  value={title}
                />
              </label>

              <label className="field">
                <span>图标</span>
                <input
                  maxLength={2}
                  onChange={(event) => setIcon(event.target.value)}
                  placeholder="✨"
                  value={icon}
                />
              </label>

              <label className="field">
                <span>奖励积分</span>
                <input
                  min="1"
                  onChange={(event) => setPoints(event.target.value)}
                  step="1"
                  type="number"
                  value={points}
                />
              </label>

              <label className="field">
                <span>奖励成长值</span>
                <input
                  min="1"
                  onChange={(event) => setGrowth(event.target.value)}
                  step="1"
                  type="number"
                  value={growth}
                />
              </label>
            </div>

            <button className="primary-button" type="submit">
              添加到今日任务
            </button>
          </form>
        ) : null}
      </section>
    </div>
  )
}
