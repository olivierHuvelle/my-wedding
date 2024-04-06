import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/app/providers'
import TheHeader from '@/components/layout/the-header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Laurie et Olivier se marient',
  description: 'My Wedding - Olivier et Laurie',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <TheHeader />
          <div className="flex h-screen items-center justify-center bg-gray-100">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
