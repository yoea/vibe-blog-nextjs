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
        // 修改密码等操作会触发 SIGNED_IN，此时跳过
        if (document.cookie.includes('skip_login_toast=')) {
          document.cookie = 'skip_login_toast=; max-age=0; path=/'
          return
        }
        // sessionStorage 防重复：标签页切换时 Supabase 会重复触发 SIGNED_IN
        if (sessionStorage.getItem('login_toast_shown')) return

        const fromLogin = document.referrer.includes('/login')
        const hasLoginCookie = document.cookie.includes('login_success=')
        if (fromLogin || hasLoginCookie) {
          sessionStorage.setItem('login_toast_shown', '1')
          if (hasLoginCookie) {
            document.cookie = 'login_success=; max-age=0; path=/'
          }
          toast.success('登录成功')
        }
      }
    })

    // 页面加载时的一次性检查（非 onAuthStateChange 触发）
    const cookies = document.cookie.split(';')
    const getCookie = (name: string) => cookies.find(c => c.trim().startsWith(`${name}=`))

    if (getCookie('link_error')) {
      document.cookie = 'link_error=; max-age=0; path=/'
      toast.error('该 GitHub 账号已被其他账号绑定，无法关联')
    }

    if (getCookie('login_success')) {
      document.cookie = 'login_success=; max-age=0; path=/'
      if (!sessionStorage.getItem('login_toast_shown')) {
        sessionStorage.setItem('login_toast_shown', '1')
        toast.success('登录成功')
      }
    }

    return () => subscription.unsubscribe()
  }, [])

  return null
}
