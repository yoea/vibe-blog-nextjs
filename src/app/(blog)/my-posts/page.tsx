import { getPostsByAuthor } from '@/lib/db/queries'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/blog/post-card'
import Link from 'next/link'

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
            <PostCard key={post.id} post={post} showActions />
          ))}
        </div>
      )}
    </div>
  )
}
