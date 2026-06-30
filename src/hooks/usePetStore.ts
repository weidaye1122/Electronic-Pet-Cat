import { useContext } from 'react'
import { PetStoreContext } from './petStoreContext'

export const usePetStore = () => {
  const context = useContext(PetStoreContext)

  if (!context) {
    throw new Error('usePetStore 必须在 PetProvider 中使用')
  }

  return context
}
