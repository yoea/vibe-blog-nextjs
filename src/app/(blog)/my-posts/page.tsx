import { getPostsByAuthor } from '@/lib/db/queries'
import { createClient } from '@/lib/supabase/server'
import { PostListClient } from '@/components/blog/post-list-client'
import { loadMoreMyPosts } from '@/lib/actions/post-actions'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUserColor } from '@/lib/utils/colors'
import { formatDaysAgo } from '@/lib/utils/time'

export default async function MyPostsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch display name
  const { data: userSettings } = await supabase
    .from('user_settings')
    .select('display_name')
    .eq('user_id', user.id)
    .maybeSingle()

  const authorName = userSettings?.display_name ?? user.email?.split('@')[0] ?? '我'
  const createdAt = user.created_at ?? null

  const { data: posts, count, error } = await getPostsByAuthor(user.id, 1, 10)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm">
        <Link href="/" className="flex items-center gap-1 pl-0">
          <ArrowLeft className="h-4 w-4" />
          返回文章列表
        </Link>
      </Button>

      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold text-white shrink-0"
          style={{ backgroundColor: getUserColor(user.id) }}
        >
          {authorName[0]}
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{authorName}</h1>
            <Link href="/posts/new">
              <Button size="sm">写新文章</Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {createdAt && (
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                加入 {formatDaysAgo(createdAt)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {count ?? 0} 篇文章
            </span>
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-destructive">加载失败: {error}</p>
      ) : (
        <PostListClient
          initialPosts={posts ?? []}
          initialTotal={count ?? 0}
          showActions
          onLoadMore={loadMoreMyPosts}
          loadedAllText="已加载全部文章"
        />
      )}
    </div>
  )
}
