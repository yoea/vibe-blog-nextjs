'use client'

import { deleteComment } from '@/lib/actions/comment-actions'
import type { CommentWithAuthor } from '@/lib/db/types'
import { Trash2 } from 'lucide-react'

export function CommentItem({ comment }: { comment: CommentWithAuthor }) {
  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm('确定删除这条评论？')) return
    try {
      await deleteComment(id, comment.post_id)
      window.location.reload()
    } catch {}
  }

  return (
    <div className="flex gap-3 border-b border-gray-100 pb-3 last:border-0">
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">
            {comment.author?.email?.split('@')[0] ?? '匿名用户'}
          </span>
          <span>{new Date(comment.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  )
}
