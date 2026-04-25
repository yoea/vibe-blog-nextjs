'use client'

import { useState } from 'react'
import { createComment } from '@/lib/actions/comment-actions'
import { CommentItem } from './comment-item'
import { CommentForm } from './comment-form'
import type { CommentWithAuthor } from '@/lib/db/types'

export function CommentSection({
  postId,
  initialComments,
}: {
  postId: string
  initialComments: CommentWithAuthor[]
}) {
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments)

  async function handleNewComment(content: string) {
    const result = await createComment(postId, content)
    if (!result.error && result.data) {
      setComments((prev) => [...prev, result.data])
      return true
    }
    return false
  }

  function handleDeleteComment(commentId: string) {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        评论 ({comments.length})
      </h3>
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
      <CommentForm postId={postId} onSubmit={handleNewComment} />
    </div>
  )
}
