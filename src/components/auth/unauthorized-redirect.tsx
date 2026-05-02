'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';

const REDIRECT_SECONDS = 5;

interface UnauthorizedRedirectProps {
  code?: string;
  title: string;
  message: string;
  actionLabel: string;
  target: string;
}

export function UnauthorizedRedirect({
  code = '403',
  title,
  message,
  actionLabel,
  target,
}: UnauthorizedRedirectProps) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      router.replace(target);
    }, REDIRECT_SECONDS * 1000);

    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [router, target]);

  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <section className="w-full max-w-md space-y-5 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{code}</p>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {message} 系统将在 {secondsLeft} 秒后自动跳转。
          </p>
        </div>

        <Link href={target} className={buttonVariants()}>
          {actionLabel}
        </Link>
      </section>
    </div>
  );
}
