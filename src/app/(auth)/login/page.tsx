import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: '登录',
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">登录</h1>
          <p className="text-sm text-muted-foreground">输入邮箱和密码继续</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          还没有账号？{' '}
          <Link href="/register" className="text-primary hover:underline">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  )
}
