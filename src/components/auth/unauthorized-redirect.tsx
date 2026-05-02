'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';

const REDIRECT_SECONDS = 5;

export function UnauthorizedRedirect() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      router.replace('/');
    }, REDIRECT_SECONDS * 1000);

    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <section className="w-full max-w-md space-y-5 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">403</p>
          <h1 className="text-2xl font-bold">无权访问</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            你没有访问该页面的权限，系统将在 {secondsLeft} 秒后返回首页。
          </p>
        </div>

        <Link href="/" className={buttonVariants()}>
          立即返回首页
        </Link>
      </section>
    </div>
  );
}
