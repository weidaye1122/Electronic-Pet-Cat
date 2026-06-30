type ActionButtonProps = {
  disabled?: boolean
  icon: string
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'soft'
}

export const ActionButton = ({
  disabled = false,
  icon,
  label,
  onClick,
  variant = 'primary',
}: ActionButtonProps) => (
  <button className={`action-button action-button--${variant}`} disabled={disabled} onClick={onClick} type="button">
    <span className="action-button__icon-wrap" aria-hidden="true">
      <span className="action-button__icon">{icon}</span>
    </span>
    <span className="action-button__label">{label}</span>
  </button>
)
