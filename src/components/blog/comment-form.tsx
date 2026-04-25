'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function CommentForm({
  postId,
  onSubmit,
}: {
  postId: string
  onSubmit: (content: string) => Promise<boolean>
}) {
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitting(true)
    setError('')
    const success = await onSubmit(comment.trim())
    if (success) {
      setComment('')
    } else {
      setError('评论失败，请重试')
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="写下你的评论..."
        rows={3}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting || !comment.trim()} size="sm">
        {submitting ? '提交中...' : '发表评论'}
      </Button>
    </form>
  )
}
