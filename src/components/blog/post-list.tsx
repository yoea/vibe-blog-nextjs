import { getPublishedPosts } from '@/lib/db/queries'
import { PostCard } from './post-card'

export async function PostList() {
  const { data: posts, error } = await getPublishedPosts()

  if (error) {
    return <p className="text-destructive">加载文章失败: {error}</p>
  }

  if (!posts.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg mb-2">还没有文章</p>
        <p className="text-sm">登录后可以写你的第一篇文章</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
