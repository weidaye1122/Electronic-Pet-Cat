type PointIconProps = {
  size?: 'sm' | 'md'
}

export const PointIcon = ({ size = 'md' }: PointIconProps) => (
  <svg
    aria-hidden="true"
    className={`point-icon point-icon--${size}`}
    viewBox="0 0 24 24"
  >
    <defs>
      <linearGradient id="point-icon-fill" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#ffe69f" />
        <stop offset="100%" stopColor="#ffb347" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" fill="url(#point-icon-fill)" r="10" />
    <circle cx="8.1" cy="8.6" fill="#6b4a2f" r="1.45" />
    <circle cx="11.3" cy="7.2" fill="#6b4a2f" r="1.35" />
    <circle cx="14.7" cy="7.2" fill="#6b4a2f" r="1.35" />
    <circle cx="17.9" cy="8.6" fill="#6b4a2f" r="1.45" />
    <path
      d="M12 10.3c-2.55 0-4.6 1.8-4.6 4.1 0 1.84 1.28 3 3.2 3 1.08 0 1.62-.46 1.98-.82.28-.26.44-.4.62-.4s.34.14.62.4c.36.36.9.82 1.98.82 1.92 0 3.2-1.16 3.2-3 0-2.3-2.05-4.1-4.6-4.1-.84 0-1.39.18-1.9.36-.18.06-.34.12-.5.12s-.32-.06-.5-.12c-.51-.18-1.06-.36-1.9-.36Z"
      fill="#6b4a2f"
    />
  </svg>
)
