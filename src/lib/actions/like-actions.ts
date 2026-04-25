'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登录' }

  const { data: post } = await supabase.from('posts').select('slug').eq('id', postId).single()

  // Check if already liked
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
  } else {
    await supabase.from('post_likes').insert({
      post_id: postId,
      user_id: user.id,
    })
  }

  if (post) revalidatePath(`/posts/${post.slug}`)
  return {}
}
