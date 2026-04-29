'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export function LoginToast() {
  useEffect(() => {
    const cookies = document.cookie.split(';')
    const getCookie = (name: string) => cookies.find(c => c.trim().startsWith(`${name}=`))

    if (getCookie('login_success')) {
      document.cookie = 'login_success=; max-age=0; path=/'
      toast.success('登录成功')
    }

    if (getCookie('link_error')) {
      document.cookie = 'link_error=; max-age=0; path=/'
      toast.error('该 GitHub 账号已被其他账号绑定，无法关联')
    }
  }, [])

  return null
}
