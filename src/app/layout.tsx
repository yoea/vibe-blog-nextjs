import type { Metadata } from 'next'
import '@/app/globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header } from '@/components/layout/header'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Blog - Supabase + Next.js',
  description: 'A blog built with Supabase and Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
