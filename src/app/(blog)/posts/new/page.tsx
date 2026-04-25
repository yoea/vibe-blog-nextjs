import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PostEditor } from '@/components/blog/post-editor'

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">写新文章</h1>
      <PostEditor />
    </div>
  )
}
