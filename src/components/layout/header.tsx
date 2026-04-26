'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LogIn, FileText, Settings, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header({ siteTitle }: { siteTitle: string }) {
  const [user, setUser] = useState<{ email: string | null } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser({ email: session.user.email ?? null })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser({ email: session.user.email ?? null })
      else setUser(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="border-b bg-white">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.svg" alt="" className="h-6 w-6" />
          <span className="font-bold text-lg">{siteTitle}</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/" className="px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
            <FileText className="h-4 w-4 inline mr-1" />
            首页
          </Link>
          <Link href="/author" className="px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
            <Users className="h-4 w-4 inline mr-1" />
            作者
          </Link>
          {user && (
            <>
              <Link href="/my-posts" className="px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                <FileText className="h-4 w-4 inline mr-1" />
                我的
              </Link>
              <Link href="/settings" className="px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                <Settings className="h-4 w-4 inline mr-1" />
                设置
              </Link>
            </>
          )}
          {!user && (
            <Link href="/login" className="px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
              <LogIn className="h-4 w-4 inline mr-1" />
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
