import { PointIcon } from './PointIcon'
import type { Task } from '../types'

type TaskCardProps = {
  task: Task
  onComplete: () => void
  onClaim: () => void
}

export const TaskCard = ({ task, onComplete, onClaim }: TaskCardProps) => {
  const currentStatus =
    task.status === 'todo'
      ? {
          chipClass: 'status-pill--todo',
          chipLabel: '待完成',
          hidden: false,
        }
      : {
          chipClass: 'status-pill--ghost',
          chipLabel: '待完成',
          hidden: true,
        }
  const actionConfig =
    task.status === 'todo'
      ? {
          className: 'primary-button',
          disabled: false,
          label: '我完成啦',
          onClick: onComplete,
        }
      : task.status === 'done'
        ? {
            className: 'primary-button',
            disabled: false,
            label: '领取奖励',
            onClick: onClaim,
          }
        : {
            className: 'primary-button',
            disabled: true,
            label: '已完成',
            onClick: onClaim,
          }

  return (
    <article className="task-card">
      <div className="task-card__header">
        <div className="task-card__title">
          <span className="emoji-badge" aria-hidden="true">
            {task.icon}
          </span>
          <div>
            <strong>{task.title}</strong>
          </div>
        </div>
      </div>

      <div className="reward-row">
        <span className="point-inline">
          <PointIcon size="sm" /> +{task.points}
        </span>
        <span>⭐ +{task.growth}</span>
        <span
          aria-hidden={currentStatus.hidden}
          className={`status-pill ${currentStatus.chipClass}`}
        >
          {currentStatus.chipLabel}
        </span>
      </div>

      <div className="task-card__actions task-card__actions--single">
        <button
          className={actionConfig.className}
          disabled={actionConfig.disabled}
          onClick={actionConfig.onClick}
          type="button"
        >
          {actionConfig.label}
        </button>
      </div>
    </article>
  )
}
