'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { toggleLike } from '@/lib/actions/like-actions'

export function LikeButton({
  postId,
  initialCount,
  isLiked,
}: {
  postId: string
  initialCount: number
  isLiked: boolean
}) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(isLiked)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async () => {
    const newLiked = !liked
    setCount((c) => (newLiked ? c + 1 : c - 1))
    setLiked(newLiked)

    startTransition(async () => {
      const result = await toggleLike(postId)
      if (result.error) {
        setLiked(!newLiked)
        setCount((c) => (!newLiked ? c + 1 : c - 1))
        if (result.error === '未登录') {
          toast.error('请先登录后再点赞')
        }
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={`gap-1.5 ${liked ? 'text-red-500 hover:text-red-600' : ''}`}
    >
      <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      <span>{count}</span>
    </Button>
  )
}
