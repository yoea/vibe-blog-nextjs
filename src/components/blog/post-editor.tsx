'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { MarkdownPreview } from '@/components/shared/markdown-preview'
import { Separator } from '@/components/ui/separator'
import { savePost } from '@/lib/actions/post-actions'
import type { PostWithAuthor } from '@/lib/db/types'

interface Props {
  initialData?: PostWithAuthor
}

export function PostEditor({ initialData }: Props) {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const isEditing = !!initialData

  // Wrap the server action to satisfy void return type
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    savePost(formData).catch(console.error)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} method="post" className="space-y-4">
        {isEditing && <input type="hidden" name="_mode" value="update" />}
        {isEditing && <input type="hidden" name="_id" value={initialData.id} />}

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">标题</label>
          <input
            id="title"
            name="title"
            required
            defaultValue={initialData?.title ?? ''}
            placeholder="文章标题"
            className="w-full px-3 py-2 rounded-md border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="excerpt" className="block text-sm font-medium">摘要（可选）</label>
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={initialData?.excerpt ?? ''}
            placeholder="一句话概括文章..."
            rows={2}
            className="w-full px-3 py-2 rounded-md border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">发布状态</span>
          <label className="inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initialData?.published ?? false}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-300 peer-checked:bg-primary rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-ring">
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4`} />
            </div>
            <span className="text-xs text-muted-foreground">
              {initialData?.published ? '已发布' : '草稿'}
            </span>
          </label>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setTab('edit')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${tab === 'edit' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-gray-100'}`}>
              编辑
            </button>
            <button type="button" onClick={() => setTab('preview')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${tab === 'preview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-gray-100'}`}>
              预览
            </button>
          </div>

          {tab === 'edit' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
              <textarea
                id="content"
                name="content"
                required
                defaultValue={initialData?.content ?? ''}
                placeholder="# 开始写作...&#10;&#10;支持 Markdown 语法:&#10;- **粗体**、*斜体*&#10;- \`代码\`&#10;- ```代码块```"
                className="font-mono text-sm p-4 h-[400px] w-full resize-none rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="border rounded-lg overflow-auto p-4 h-[400px] bg-white">
                <p className="text-sm text-muted-foreground">输入内容后点击"预览"</p>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-6 overflow-auto h-[400px] bg-white">
              <LiveContentPreview />
            </div>
          )}
        </div>

        <SubmitButton isEditing={isEditing} />
      </form>
    </div>
  )
}

function LiveContentPreview() {
  const [content, setContent] = useState('# 预览你的文章\n\n开始写作吧！')

  useEffect(() => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement | null
    if (textarea) setContent(textarea.value || '# 预览你的文章\n\n开始写作吧！')
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const textarea = document.getElementById('content') as HTMLTextAreaElement | null
      if (textarea) setContent(textarea.value)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return content.trim() ? <MarkdownPreview content={content} /> : null
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
    >
      {pending ? (isEditing ? '保存中...' : '创建中...') : (isEditing ? '保存修改' : '创建文章')}
    </button>
  )
}
