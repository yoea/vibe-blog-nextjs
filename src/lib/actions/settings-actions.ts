'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserSettings(displayName: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登录' }

  const { error } = await supabase.from('user_settings')
    .upsert({ user_id: user.id, display_name: displayName || null }, { onConflict: 'user_id' })

  if (error) return { error: error.message }
  revalidatePath('/settings')
  return {}
}
