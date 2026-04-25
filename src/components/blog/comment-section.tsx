'use client'

import { CommentItem } from './comment-item'
import { CommentForm } from './comment-form'
import type { CommentWithAuthor } from '@/lib/db/types'

export function CommentSection({
  postId,
  comments,
}: {
  postId: string
  comments: CommentWithAuthor[]
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        评论 ({comments.length})
      </h3>
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      <CommentForm postId={postId} />
    </div>
  )
}
