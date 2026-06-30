const pad = (value: number) => value.toString().padStart(2, '0')

export const getLocalDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const fromDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

export const getDayDifference = (fromKey: string, toKey: string) => {
  if (!fromKey || !toKey) {
    return 0
  }

  const from = fromDateKey(fromKey)
  const to = fromDateKey(toKey)
  const delta = to.getTime() - from.getTime()

  return Math.round(delta / 86_400_000)
}
