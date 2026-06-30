import { useEffect, useState } from 'react'
import { usePetStore } from '../hooks/usePetStore'
import { createPasswordSalt, hashNumericPassword, normalizeNumericPassword } from '../utils/auth'

type PasswordField = 'confirm' | 'primary'

const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '清空', '0', '退格']

const maskPassword = (value: string) => (value ? '•'.repeat(value.length) : '')

export const AuthGate = () => {
  const {
    completeFirstRunSetup,
    isSessionUnlocked,
    isStoreReady,
    meta,
    pet,
    unlockSession,
  } = usePetStore()
  const [petName, setPetName] = useState(pet.name)
  const [userName, setUserName] = useState(meta.userName)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [activePasswordField, setActivePasswordField] = useState<PasswordField>('primary')
  const [errorText, setErrorText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasPassword = Boolean(meta.passwordHash && meta.passwordSalt)
  const isSetupMode = isStoreReady && !hasPassword

  useEffect(() => {
    setPetName(pet.name)
  }, [pet.name])

  useEffect(() => {
    setUserName(meta.userName)
  }, [meta.userName])

  const updateActivePassword = (updater: (current: string) => string) => {
    if (!isSetupMode || activePasswordField === 'primary') {
      setPassword((current) => normalizeNumericPassword(updater(current)))
      return
    }

    setConfirmPassword((current) => normalizeNumericPassword(updater(current)))
  }

  const handleKeypadPress = (key: string) => {
    setErrorText('')

    if (key === '清空') {
      updateActivePassword(() => '')
      return
    }

    if (key === '退格') {
      updateActivePassword((current) => current.slice(0, -1))
      return
    }

    updateActivePassword((current) => `${current}${key}`)
  }

  const handleSetup = async () => {
    const nextPetName = petName.trim()
    const nextUserName = userName.trim()

    if (!nextPetName || !nextUserName) {
      setErrorText('先把猫猫名字和你的名字填好。')
      return
    }

    if (password.length < 4) {
      setErrorText('密码至少需要 4 位数字。')
      return
    }

    if (password !== confirmPassword) {
      setErrorText('两次输入的密码不一样。')
      return
    }

    setIsSubmitting(true)
    const passwordSalt = createPasswordSalt()
    const passwordHash = await hashNumericPassword(password, passwordSalt)
    completeFirstRunSetup({
      passwordHash,
      passwordSalt,
      petName: nextPetName,
      userName: nextUserName,
    })
    setIsSubmitting(false)
  }

  const handleLogin = async () => {
    if (!meta.passwordHash || !meta.passwordSalt) {
      return
    }

    setIsSubmitting(true)
    const passwordHash = await hashNumericPassword(password, meta.passwordSalt)
    setIsSubmitting(false)

    if (passwordHash !== meta.passwordHash) {
      setErrorText('密码不对，再试一次。')
      setPassword('')
      return
    }

    unlockSession()
  }

  const handleSubmit = () => {
    void (isSetupMode ? handleSetup() : handleLogin())
  }

  if (isSessionUnlocked) {
    return null
  }

  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <div className="auth-hero" aria-hidden="true">
          <span className="auth-hero__ear auth-hero__ear--left" />
          <span className="auth-hero__ear auth-hero__ear--right" />
          <span className="auth-hero__face">
            <span className="auth-hero__eye auth-hero__eye--left" />
            <span className="auth-hero__eye auth-hero__eye--right" />
            <span className="auth-hero__nose" />
          </span>
        </div>

        <div className="auth-copy">
          <p className="eyebrow">小猫成长记</p>
          <h1>{isStoreReady ? (isSetupMode ? '第一次见面' : '欢迎回来') : '正在准备'}</h1>
          <p>
            {isStoreReady
              ? isSetupMode
                ? '先给小猫和自己起个名字，再设置一个数字密码。'
                : '输入数字密码，就可以继续陪小猫成长。'
              : '正在读取存档，请稍等一下。'}
          </p>
        </div>

        {isStoreReady ? (
          <>
            {isSetupMode ? (
              <div className="auth-fields">
                <label className="field">
                  <span>猫猫名字</span>
                  <input
                    autoComplete="off"
                    maxLength={12}
                    onChange={(event) => setPetName(event.target.value)}
                    placeholder="比如 小团团"
                    type="text"
                    value={petName}
                  />
                </label>

                <label className="field">
                  <span>你的名字</span>
                  <input
                    autoComplete="name"
                    maxLength={12}
                    onChange={(event) => setUserName(event.target.value)}
                    placeholder="比如 眠眠"
                    type="text"
                    value={userName}
                  />
                </label>
              </div>
            ) : null}

            <div className="password-fields">
              <label className="password-display">
                <span>{isSetupMode ? '设置密码' : '输入密码'}</span>
                <input
                  inputMode="numeric"
                  onChange={(event) => {
                    setErrorText('')
                    setPassword(normalizeNumericPassword(event.target.value))
                  }}
                  onFocus={() => setActivePasswordField('primary')}
                  pattern="[0-9]*"
                  type="password"
                  value={password}
                />
                <strong aria-hidden="true">{maskPassword(password) || '----'}</strong>
              </label>

              {isSetupMode ? (
                <label className="password-display">
                  <span>再输一次</span>
                  <input
                    inputMode="numeric"
                    onChange={(event) => {
                      setErrorText('')
                      setConfirmPassword(normalizeNumericPassword(event.target.value))
                    }}
                    onFocus={() => setActivePasswordField('confirm')}
                    pattern="[0-9]*"
                    type="password"
                    value={confirmPassword}
                  />
                  <strong aria-hidden="true">{maskPassword(confirmPassword) || '----'}</strong>
                </label>
              ) : null}
            </div>

            <div className="number-pad" aria-label="数字输入键盘">
              {keypadKeys.map((key) => (
                <button
                  className={key.length === 1 ? 'number-key' : 'number-key number-key--utility'}
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  type="button"
                >
                  {key}
                </button>
              ))}
            </div>

            {errorText ? <p className="auth-error">{errorText}</p> : null}

            <button
              className="primary-button auth-submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              type="button"
            >
              {isSetupMode ? '开始陪伴' : '进入小家'}
            </button>
          </>
        ) : (
          <div className="auth-loading" aria-label="读取中" />
        )}
      </section>
    </main>
  )
}
