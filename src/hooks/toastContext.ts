import { createContext } from 'react'

export type ToastContextValue = {
  showToast: (text: string) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
