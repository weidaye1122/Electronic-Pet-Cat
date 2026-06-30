import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { Toast } from '../components/Toast'
import type { ToastMessage } from '../types'

type ToastContextValue = {
  showToast: (text: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const removeToast = (id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id))
  }

  const showToast = (text: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setMessages((current) => [...current, { id, text }])
    window.setTimeout(() => removeToast(id), 2400)
  }

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <Toast messages={messages} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast 必须在 ToastProvider 中使用')
  }

  return context
}
