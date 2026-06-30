import type { PersistedAppState } from '../types'

const cloneValue = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

export const storageKeys = {
  pet: 'pet-data',
  tasks: 'task-data',
  shop: 'shop-data',
  inventory: 'inventory-data',
  pointRecords: 'point-records',
  meta: 'pet-meta-data',
} as const

const persistenceApiPath = import.meta.env.VITE_PERSISTENCE_API_PATH || '/api/state'

const loadSlice = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return cloneValue(fallback)
  }

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : cloneValue(fallback)
  } catch {
    return cloneValue(fallback)
  }
}

const saveSlice = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export const loadLocalAppState = (fallback: PersistedAppState): PersistedAppState => ({
  pet: loadSlice(storageKeys.pet, fallback.pet),
  tasks: loadSlice(storageKeys.tasks, fallback.tasks),
  shopItems: loadSlice(storageKeys.shop, fallback.shopItems),
  inventory: loadSlice(storageKeys.inventory, fallback.inventory),
  pointRecords: loadSlice(storageKeys.pointRecords, fallback.pointRecords),
  meta: loadSlice(storageKeys.meta, fallback.meta),
})

export const saveLocalAppState = (state: PersistedAppState) => {
  saveSlice(storageKeys.pet, state.pet)
  saveSlice(storageKeys.tasks, state.tasks)
  saveSlice(storageKeys.shop, state.shopItems)
  saveSlice(storageKeys.inventory, state.inventory)
  saveSlice(storageKeys.pointRecords, state.pointRecords)
  saveSlice(storageKeys.meta, state.meta)
}

export const clearLocalAppState = () => {
  if (typeof window === 'undefined') {
    return
  }

  Object.values(storageKeys).forEach((key) => {
    window.localStorage.removeItem(key)
  })
}

export const loadRemoteAppState = async () => {
  const response = await fetch(persistenceApiPath, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`加载后端存档失败: ${response.status}`)
  }

  return (await response.json()) as PersistedAppState
}

export const saveRemoteAppState = async (state: PersistedAppState) => {
  const response = await fetch(persistenceApiPath, {
    body: JSON.stringify(state),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  })

  if (!response.ok) {
    throw new Error(`保存后端存档失败: ${response.status}`)
  }
}
