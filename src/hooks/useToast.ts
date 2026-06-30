import { useContext } from 'react'
import { ToastContext } from './toastContext'

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast 必须在 ToastProvider 中使用')
  }

  return context
}
