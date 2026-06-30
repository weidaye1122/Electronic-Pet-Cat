import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: '🐾', label: '首页' },
  { to: '/tasks', icon: '📖', label: '任务' },
  { to: '/shop', icon: '🛍️', label: '商店' },
  { to: '/inventory', icon: '🎒', label: '背包' },
  { to: '/growth', icon: '🌟', label: '成长' },
]

export const BottomNav = () => (
  <nav className="bottom-nav" aria-label="主导航">
    {navItems.map((item) => (
      <NavLink
        className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
        end={item.to === '/'}
        key={item.to}
        to={item.to}
      >
        <span aria-hidden="true">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
)
