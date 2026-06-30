const textEncoder = new TextEncoder()

const bufferToHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')

const fallbackHash = (value: string) => {
  let hash = 0x811c9dc5

  for (const char of value) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 0x01000193)
  }

  return `fallback-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

export const normalizeNumericPassword = (value: string) => value.replace(/\D/g, '').slice(0, 12)

export const createPasswordSalt = () => {
  const bytes = new Uint8Array(16)

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes)
  } else {
    bytes.forEach((_, index) => {
      bytes[index] = Math.floor(Math.random() * 256)
    })
  }

  return Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
}

export const hashNumericPassword = async (password: string, salt: string) => {
  const normalizedPassword = normalizeNumericPassword(password)
  const payload = `${salt}:${normalizedPassword}`

  if (!globalThis.crypto?.subtle) {
    return fallbackHash(payload)
  }

  const digest = await globalThis.crypto.subtle.digest('SHA-256', textEncoder.encode(payload))

  return `sha256-${bufferToHex(digest)}`
}
