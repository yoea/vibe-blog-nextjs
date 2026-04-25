'use client'

import { useState, useTransition } from 'react'
import { createComment } from '@/lib/actions/comment-actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { CommentWithAuthor } from '@/lib/db/types'

export function CommentForm({ postId }: { postId: string }) {
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    startTransition(async () => {
      const result = await createComment(postId, comment)
      if (!result.error) {
        setComment('')
        window.location.reload()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="写下你的评论..."
        rows={3}
      />
      <Button type="submit" disabled={isPending || !comment.trim()} size="sm">
        {isPending ? '提交中...' : '发表评论'}
      </Button>
    </form>
  )
}
