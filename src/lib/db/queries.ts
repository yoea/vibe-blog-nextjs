import { createClient } from '@/lib/supabase/server'
import type { PostWithAuthor, CommentWithAuthor } from '@/lib/db/types'

export async function getPublishedPosts(page = 1, limit = 10) {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('posts')
    .select(
      `
      id, author_id, title, slug, content, excerpt, published, created_at, updated_at,
      like_count:post_likes(count),
      comment_count:post_comments(count)
    `,
      { count: 'exact' }
    )
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return { data: [], count: 0, error: error.message }

  const result = data.map((item: any) => ({
    ...item,
    author: { email: null },
    like_count: item.like_count?.[0]?.count ?? 0,
    comment_count: item.comment_count?.[0]?.count ?? 0,
  })) as unknown as PostWithAuthor[]

  return { data: result, count, error: null }
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (postError) return { data: null, error: postError.message }
  if (!post) return { data: null, error: '文章不存在' }

  // Allow viewing own draft posts
  if (!post.published && (!user || user.id !== post.author_id)) {
    return { data: null, error: '文章不存在' }
  }

  const { count: likeCount } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', post.id)

  const { data: userLike } = user
    ? await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .maybeSingle()
    : { data: null }

  const { count: commentCount } = await supabase
    .from('post_comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', post.id)

  const result = {
    ...post,
    author: { email: null },
    like_count: likeCount ?? 0,
    comment_count: commentCount ?? 0,
    is_liked_by_current_user: !!userLike,
  } as unknown as PostWithAuthor

  return { data: result, error: null }
}

export async function getCommentsForPost(postId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('post_comments')
    .select(
      `
      id, post_id, author_id, content, created_at, updated_at
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) return { data: [], error: error.message }
  const result = data.map((item: any) => ({ ...item, author: { email: null } })) as unknown as CommentWithAuthor[]
  return { data: result, error: null }
}

export async function getPostsByAuthor(authorId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })

  if (error) return { data: [], error: error.message }
  return { data, error: null }
}
