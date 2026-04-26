import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import '@/app/globals.css'
import 'nprogress/nprogress.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'sonner'
import { ProgressBar } from '@/components/layout/progress-bar'
import { ThemeProvider } from '@/components/layout/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? 'Blog'
  return {
    title: {
      default: siteTitle,
      template: `%s - ${siteTitle}`,
    },
    description: 'A blog built with Supabase and Next.js',
    icons: {
      icon: '/logo.svg',
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? 'Blog'
  const cookieStore = await cookies()
  const resolved = cookieStore.get('themeResolved')?.value
  const initialDark = resolved === 'dark'

  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} antialiased${initialDark ? ' dark' : ''}`} suppressHydrationWarning>
      <body className="flex flex-col bg-background">
        <ThemeProvider>
          <ProgressBar />
          <Header siteTitle={siteTitle} />
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">{children}</main>
          <Footer />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
