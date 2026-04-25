'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createComment(postId: string, content: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登录' }
  if (!content.trim()) return { error: '评论内容不能为空' }

  const { error } = await supabase.from('post_comments').insert({
    post_id: postId,
    author_id: user.id,
    content: content.trim(),
  })

  if (error) return { error: error.message }
  revalidatePath(`/posts/[${postId}]`)
  return {}
}

export async function deleteComment(commentId: string, postId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登录' }

  const { error } = await supabase.from('post_comments')
    .delete()
    .eq('id', commentId)
    .eq('author_id', user.id)

  if (error) return { error: error.message }
  revalidatePath(`/posts/[${postId}]`)
  return {}
}
