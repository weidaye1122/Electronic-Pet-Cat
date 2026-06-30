type StatusBarProps = {
  icon: string
  label: string
  value: number
  maxValue?: number
  tone: 'orange' | 'pink' | 'blue' | 'green'
}

export const StatusBar = ({ icon, label, value, maxValue = 100, tone }: StatusBarProps) => (
  <article className="status-card">
    <div className="status-head">
      <span className="status-icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <strong>{label}</strong>
        <small>
          {value}/{maxValue}
        </small>
      </div>
    </div>
    <div className="progress-track">
      <span
        className={`progress-fill progress-fill--${tone}`}
        style={{ width: `${Math.min(100, (value / maxValue) * 100)}%` }}
      />
    </div>
  </article>
)
