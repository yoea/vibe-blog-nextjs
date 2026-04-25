import { getPostBySlug } from '@/lib/db/queries'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { PostEditor } from '@/components/blog/post-editor'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditPostPage({ params }: PageProps) {
  const { slug } = await params
  const { data: post, error } = await getPostBySlug(slug)

  if (!post || error) {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== post.author_id) {
    return <p className="text-destructive">无权编辑此文章</p>
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm">
        <Link href={`/posts/${post.slug}`} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          返回文章详情
        </Link>
      </Button>
      <h1 className="text-3xl font-bold">编辑文章</h1>
      <PostEditor initialData={post as any} />
    </div>
  )
}
