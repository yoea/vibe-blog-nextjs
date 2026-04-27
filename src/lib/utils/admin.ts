import { createClient } from '@/lib/supabase/server'

export async function isSuperAdmin(): Promise<boolean> {
  const adminEmails = process.env.SUPER_ADMIN_EMAILS
  if (!adminEmails) return false

  const emails = adminEmails.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  if (emails.length === 0) return false

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return false

  return emails.includes(user.email.toLowerCase())
}
