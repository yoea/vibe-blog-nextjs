'use client'

interface LocalDraft {
  title: string
  content: string
  excerpt: string
  published: boolean
  savedAt: number
}

const DRAFT_PREFIX = 'post_draft_'
const DRAFT_KEY_NEW = 'post_draft_new'

function formatTimeAgo(savedAt: number): string {
  const diff = Date.now() - savedAt
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '几秒前'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  return `${Math.floor(hours / 24)} 天前`
}

function getDraft(key: string): LocalDraft | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setDraft(key: string, data: Omit<LocalDraft, 'savedAt'>) {
  try {
    localStorage.setItem(key, JSON.stringify({ ...data, savedAt: Date.now() }))
  } catch {
    // localStorage 满了或不可用，静默失败
  }
}

function removeDraft(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // 静默失败
  }
}

export function useLocalDraft(
  draftKey: string | null,
  initialData?: { updated_at: string } | null,
) {
  const key = draftKey ?? DRAFT_KEY_NEW
  const draft = getDraft(key)

  const hasNewerDraft =
    !!draft &&
    !!initialData &&
    draft.savedAt > new Date(initialData.updated_at).getTime()

  const savedAt = draft?.savedAt ?? null
  const timeAgo = savedAt ? formatTimeAgo(savedAt) : null

  function restore(): Partial<{ title: string; content: string; excerpt: string; published: boolean }> | null {
    const d = getDraft(key)
    if (!d) return null
    return { title: d.title, content: d.content, excerpt: d.excerpt, published: d.published }
  }

  function discard() {
    removeDraft(key)
  }

  function save(data: { title: string; content: string; excerpt: string; published: boolean }) {
    setDraft(key, data)
  }

  function clear() {
    removeDraft(key)
  }

  return { hasNewerDraft, savedAt, timeAgo, restore, discard, save, clear }
}
