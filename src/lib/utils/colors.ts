export const MORANDI_COLORS = [
  '#7a8b6f',
  '#8b7355',
  '#6b7d8e',
  '#9a7b7b',
  '#7b8a7b',
  '#8a7b6b',
  '#6f7a8b',
]

export function getUserColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return MORANDI_COLORS[Math.abs(hash) % MORANDI_COLORS.length]
}
