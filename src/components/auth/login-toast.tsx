'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export function LoginToast() {
  useEffect(() => {
    const cookies = document.cookie.split(';')
    const loginSuccess = cookies.find(c => c.trim().startsWith('login_success='))
    if (loginSuccess) {
      // 删除 cookie
      document.cookie = 'login_success=; max-age=0; path=/'
      toast.success('登录成功')
    }
  }, [])

  return null
}
