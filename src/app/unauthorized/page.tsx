import { UnauthorizedRedirect } from '@/components/auth/unauthorized-redirect';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '无权访问',
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  searchParams: Promise<{
    reason?: string;
    redirect?: string;
  }>;
}

function normalizeRedirect(redirectTo?: string) {
  if (
    !redirectTo ||
    !redirectTo.startsWith('/') ||
    redirectTo.startsWith('//')
  ) {
    return '/profile';
  }

  return redirectTo;
}

export default async function UnauthorizedPage({ searchParams }: PageProps) {
  const { reason, redirect } = await searchParams;

  if (reason === 'login') {
    const redirectTo = normalizeRedirect(redirect);
    return (
      <UnauthorizedRedirect
        code="401"
        title="需要登录"
        message="你需要登录后才能访问该页面。"
        actionLabel="立即登录"
        target={`/login?redirect=${encodeURIComponent(redirectTo)}`}
      />
    );
  }

  return (
    <UnauthorizedRedirect
      title="无权访问"
      message="你没有访问该页面的权限。"
      actionLabel="立即返回首页"
      target="/"
    />
  );
}
