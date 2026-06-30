import type { ToastMessage } from '../types'

type ToastProps = {
  messages: ToastMessage[]
  onDismiss: (id: string) => void
}

export const Toast = ({ messages, onDismiss }: ToastProps) => (
  <div className="toast-stack" aria-live="polite" aria-atomic="true">
    {messages.map((message) => (
      <button className="toast" key={message.id} onClick={() => onDismiss(message.id)} type="button">
        {message.text}
      </button>
    ))}
  </div>
)
