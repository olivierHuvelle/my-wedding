import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/app/providers'
import TheHeader from '@/components/layout/the-header'
import { Toaster } from 'react-hot-toast'
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
          <div className="flex min-h-screen justify-center bg-gray-100">{children}</div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
