'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const MAX_COMMENT_LENGTH = 500

export function CommentForm({
  postId,
  onSubmit,
}: {
  postId: string
  onSubmit: (content: string) => Promise<{ success: boolean; error?: string }>
}) {
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    if (comment.trim().length > MAX_COMMENT_LENGTH) return

    setSubmitting(true)
    setError('')
    const result = await onSubmit(comment.trim())
    if (result.success) {
      setComment('')
    } else {
      if (result.error === '未登录') {
        setError('请先登录后再评论')
      } else {
        setError('评论失败，请重试')
      }
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
        maxLength={MAX_COMMENT_LENGTH}
      />
      <div className="flex items-center justify-between">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground ml-auto">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </p>
      </div>
      <Button type="submit" disabled={submitting || !comment.trim() || comment.trim().length > MAX_COMMENT_LENGTH} size="sm">
        {submitting ? '提交中...' : '发表评论'}
      </Button>
    </form>
  )
}
