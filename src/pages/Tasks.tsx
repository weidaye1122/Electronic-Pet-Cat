import { useState } from 'react'
import type { FormEvent } from 'react'
import { TaskCard } from '../components/TaskCard'
import { usePetStore } from '../hooks/usePetStore'

export const Tasks = () => {
  const {
    tasks,
    taskStats,
    markTaskDone,
    claimTaskReward,
    addCustomTask,
    updateCustomTask,
    deleteCustomTask,
  } = usePetStore()
  const [showCreator, setShowCreator] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState('')
  const [managedTaskId, setManagedTaskId] = useState('')
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('✨')
  const [points, setPoints] = useState('10')
  const [growth, setGrowth] = useState('5')
  const isEditing = Boolean(editingTaskId)
  const managedTask = tasks.find((task) => task.id === managedTaskId)

  const resetEditor = () => {
    setEditingTaskId('')
    setTitle('')
    setIcon('✨')
    setPoints('10')
    setGrowth('5')
  }

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId)

    if (!task) {
      return
    }

    setManagedTaskId('')
    setEditingTaskId(task.id)
    setTitle(task.title)
    setIcon(task.icon)
    setPoints(String(task.points))
    setGrowth(String(task.growth))
    setShowCreator(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setManagedTaskId('')
    deleteCustomTask(taskId)

    if (editingTaskId === taskId) {
      resetEditor()
      setShowCreator(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextTask = {
      title,
      icon,
      points: Number(points),
      growth: Number(growth),
    }

    if (isEditing) {
      updateCustomTask(editingTaskId, nextTask)
    } else {
      addCustomTask(nextTask)
    }

    if (!title.trim()) {
      return
    }

    resetEditor()
    setShowCreator(false)
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
              onManage={task.id.startsWith('custom-') ? () => setManagedTaskId(task.id) : undefined}
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
            onClick={() => {
              if (showCreator) {
                resetEditor()
              }

              setShowCreator((current) => !current)
            }}
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
              {isEditing ? '保存任务' : '添加到今日任务'}
            </button>

            {isEditing ? (
              <button
                className="ghost-button form-card__cancel"
                onClick={() => {
                  resetEditor()
                  setShowCreator(false)
                }}
                type="button"
              >
                取消编辑
              </button>
            ) : null}
          </form>
        ) : null}
      </section>

      {managedTask ? (
        <div
          className="task-manage-modal"
          onClick={() => setManagedTaskId('')}
          role="presentation"
        >
          <section
            aria-label={`管理任务 ${managedTask.title}`}
            aria-modal="true"
            className="task-manage-sheet"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="task-manage-sheet__summary">
              <span className="emoji-badge" aria-hidden="true">
                {managedTask.icon}
              </span>
              <div>
                <small>管理自定义任务</small>
                <strong>{managedTask.title}</strong>
              </div>
            </div>

            <div className="task-manage-sheet__actions">
              <button
                className="ghost-button"
                onClick={() => handleEditTask(managedTask.id)}
                type="button"
              >
                编辑
              </button>

              <button
                className="ghost-button ghost-button--danger"
                onClick={() => handleDeleteTask(managedTask.id)}
                type="button"
              >
                删除
              </button>
            </div>

            <button
              className="ghost-button task-manage-sheet__cancel"
              onClick={() => setManagedTaskId('')}
              type="button"
            >
              取消
            </button>
          </section>
        </div>
      ) : null}
    </div>
  )
}
