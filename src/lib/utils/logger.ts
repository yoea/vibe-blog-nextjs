const isDev = process.env.NODE_ENV === 'development'
const debugEnabled = process.env.DEBUG === 'true'

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev || debugEnabled) {
      console.log('[INFO]', ...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev || debugEnabled) {
      console.warn('[WARN]', ...args)
    }
  },
  error: (...args: unknown[]) => {
    // 错误始终输出
    console.error('[ERROR]', ...args)
  },
  debug: (...args: unknown[]) => {
    if (debugEnabled) {
      console.log('[DEBUG]', ...args)
    }
  },
}
