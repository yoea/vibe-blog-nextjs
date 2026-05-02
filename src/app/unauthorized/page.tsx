import { UnauthorizedRedirect } from '@/components/auth/unauthorized-redirect';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '无权访问',
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnauthorizedPage() {
  return <UnauthorizedRedirect />;
}
