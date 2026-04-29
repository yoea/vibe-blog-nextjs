'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export function LoginToast() {
  useEffect(() => {
    const supabase = createClient()

    // 监听 auth 状态变化（GitHub OAuth / 邮箱登录都会触发 SIGNED_IN 事件）
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // 检查是否从登录页跳转过来（避免刷新页面时重复提示）
        const fromLogin = document.referrer.includes('/login')
        const hasLoginCookie = document.cookie.includes('login_success=')
        if (fromLogin || hasLoginCookie) {
          if (hasLoginCookie) {
            document.cookie = 'login_success=; max-age=0; path=/'
          }
          toast.success('登录成功')
        }
      }
    })

    // 处理非 OAuth 的 cookie-based 提示（如 link_error）
    const cookies = document.cookie.split(';')
    const getCookie = (name: string) => cookies.find(c => c.trim().startsWith(`${name}=`))

    if (getCookie('link_error')) {
      document.cookie = 'link_error=; max-age=0; path=/'
      toast.error('该 GitHub 账号已被其他账号绑定，无法关联')
    }

    // 兼容旧流程：邮箱登录后 callback 设置的 login_success cookie
    if (getCookie('login_success')) {
      document.cookie = 'login_success=; max-age=0; path=/'
      toast.success('登录成功')
    }

    return () => subscription.unsubscribe()
  }, [])

  return null
}
