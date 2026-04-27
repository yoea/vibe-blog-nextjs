'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { autoSaveDraft } from '@/lib/actions/draft-actions'

interface UseAutoSaveOptions {
  postId: string | null
  title: string
  content: string
  excerpt: string
  onPostCreated?: (postId: string, slug: string) => void
}

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const SAVE_INTERVAL_MS = 30_000
const SAVED_VISIBLE_MS = 3_000

export function useAutoSave({
  postId: initialPostId,
  title,
  content,
  excerpt,
  onPostCreated,
}: UseAutoSaveOptions) {
  const [status, setStatus] = useState<AutoSaveStatus>('idle')
  const [postId, setPostId] = useState<string | null>(initialPostId)

  // Refs to avoid restarting the timer when values change
  const postIdRef = useRef(postId)
  const titleRef = useRef(title)
  const contentRef = useRef(content)
  const excerptRef = useRef(excerpt)
  const lastSavedRef = useRef({ title: '', content: '', excerpt: '' })
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onPostCreatedRef = useRef(onPostCreated)

  // Keep refs in sync
  postIdRef.current = postId
  titleRef.current = title
  contentRef.current = content
  excerptRef.current = excerpt
  onPostCreatedRef.current = onPostCreated

  // Sync postId from props
  useEffect(() => {
    if (initialPostId) setPostId(initialPostId)
  }, [initialPostId])

  const doSave = useCallback(async () => {
    const current = {
      title: titleRef.current,
      content: contentRef.current,
      excerpt: excerptRef.current,
    }
    const last = lastSavedRef.current

    if (current.title === last.title && current.content === last.content && current.excerpt === last.excerpt) {
      return
    }

    setStatus('saving')

    const result = await autoSaveDraft({
      postId: postIdRef.current ?? undefined,
      title: current.title,
      content: current.content,
      excerpt: current.excerpt,
    })

    if (result.error) {
      setStatus('error')
      return
    }

    // New post was created
    if (result.postId && result.slug && !postIdRef.current) {
      setPostId(result.postId)
      onPostCreatedRef.current?.(result.postId, result.slug)
    }

    lastSavedRef.current = current
    setStatus('saved')

    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    savedTimerRef.current = setTimeout(() => setStatus('idle'), SAVED_VISIBLE_MS)
  }, []) // stable: all values via refs

  // Timer
  useEffect(() => {
    const timer = setInterval(doSave, SAVE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [doSave])

  // Final save on unmount
  useEffect(() => {
    return () => {
      const current = {
        title: titleRef.current,
        content: contentRef.current,
        excerpt: excerptRef.current,
      }
      const last = lastSavedRef.current
      if (current.title !== last.title || current.content !== last.content || current.excerpt !== last.excerpt) {
        autoSaveDraft({
          postId: postIdRef.current ?? undefined,
          title: current.title,
          content: current.content,
          excerpt: current.excerpt,
        })
      }
    }
  }, [])

  const retry = useCallback(() => { doSave() }, [doSave])

  return { status, postId, retry }
}
