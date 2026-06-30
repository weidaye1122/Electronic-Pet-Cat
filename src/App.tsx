import { useEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { LevelUpCelebration } from './components/LevelUpCelebration'
import { PetProvider, usePetStore } from './hooks/usePetStore'
import { ToastProvider } from './hooks/useToast'
import { Growth } from './pages/Growth'
import { Home } from './pages/Home'
import { Inventory } from './pages/Inventory'
import { Shop } from './pages/Shop'
import { Tasks } from './pages/Tasks'

function AppLayout() {
  const { pet, meta, taskStats, levelUpCelebration, resetAllData, setProfileAvatar } =
    usePetStore()
  const location = useLocation()
  const navigate = useNavigate()
  const hasHandledResetRef = useRef(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)

    if (searchParams.get('reset') !== '1') {
      hasHandledResetRef.current = false
      return
    }

    if (hasHandledResetRef.current) {
      return
    }

    hasHandledResetRef.current = true
    resetAllData()
    navigate('/', { replace: true })
  }, [location.search, navigate, resetAllData])

  const handleAvatarPick = () => {
    avatarInputRef.current?.click()
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result

      if (typeof result === 'string') {
        setProfileAvatar(result)
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <div className="app-shell">
      {levelUpCelebration ? (
        <LevelUpCelebration
          key={levelUpCelebration.token}
          level={levelUpCelebration.level}
        />
      ) : null}

      <header className="app-header">
        <div className="app-header__main">
          <button
            className={`profile-avatar ${meta.profileAvatar ? 'profile-avatar--filled' : ''}`}
            onClick={handleAvatarPick}
            type="button"
          >
            {meta.profileAvatar ? (
              <img alt="小朋友头像" className="profile-avatar__image" src={meta.profileAvatar} />
            ) : (
              <span className="profile-avatar__placeholder" aria-hidden="true">
                🧒
              </span>
            )}
          </button>

          <input
            accept="image/*"
            className="profile-avatar__input"
            onChange={handleAvatarChange}
            ref={avatarInputRef}
            type="file"
          />

          <div className="app-header__intro">
            <p className="eyebrow">儿童互动电子宠物</p>
            <div className="app-header__title-row">
              <h1>小猫成长记</h1>
              <p className="header-copy">
                陪着 {pet.name} 一起做任务、拿积分、慢慢长大。
              </p>
            </div>
          </div>
        </div>
        <p className="app-header__meta">连续 {meta.streakCount} 天 · 完成 {taskStats.done}/{taskStats.total}</p>
      </header>

      <main className="page-container">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Tasks />} path="/tasks" />
          <Route element={<Shop />} path="/shop" />
          <Route element={<Inventory />} path="/inventory" />
          <Route element={<Growth />} path="/growth" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </main>

      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <PetProvider>
        <AppLayout />
      </PetProvider>
    </ToastProvider>
  )
}
