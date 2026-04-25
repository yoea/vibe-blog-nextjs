'use client'

import { useFormStatus } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function RegisterForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-sm space-y-4 p-6 border rounded-lg bg-green-50 text-green-800">
        <p className="font-semibold">注册成功！请检查邮箱完成验证。</p>
        <p className="text-sm">如果未收到邮件，请在 Supabase Dashboard 中关闭 "Confirm email"。</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">邮箱</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" required
          className="w-full px-3 py-2 rounded-md border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">密码</label>
        <input id="password" name="password" type="password" required minLength={6}
          className="w-full px-3 py-2 rounded-md border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}
      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
      {pending ? '注册中...' : '注册'}
    </button>
  )
}
