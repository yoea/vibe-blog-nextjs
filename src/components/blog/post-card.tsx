import Link from 'next/link'
import { Calendar, Heart, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { PostWithAuthor } from '@/lib/db/types'

export function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.slug}`} className="block">
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold leading-tight">{post.title}</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.created_at).toLocaleDateString('zh-CN')}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {post.like_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {post.comment_count}
            </span>
            {post.author?.email && (
              <span className="flex items-center gap-1">
                {post.author.email.split('@')[0]}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
