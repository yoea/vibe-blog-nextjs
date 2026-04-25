import { getUserSettings } from '@/lib/db/queries'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SettingsForm } from '@/components/settings/settings-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: settings } = await getUserSettings()
  const displayName = settings?.display_name ?? user.email?.split('@')[0] ?? ''

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">设置</h1>
      <SettingsForm
        user={user}
        displayName={displayName}
      />
    </div>
  )
}
