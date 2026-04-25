import { getPostsByAuthor } from '@/lib/db/queries'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PostActions } from '@/components/blog/post-actions'

export default async function MyPostsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: posts, error } = await getPostsByAuthor(user.id)

  if (error) {
    return <p className="text-destructive">加载失败: {error}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">我的文章</h1>
        <Link href="/posts/new" className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity cursor-pointer">
          写新文章
        </Link>
      </div>

      {!posts.length ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">还没有文章</p>
          <p className="text-sm">点击右上角按钮开始写作</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2 space-y-0">
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
                  <Badge variant={post.published ? 'secondary' : 'outline'}>
                    {post.published ? '已发布' : '草稿'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
