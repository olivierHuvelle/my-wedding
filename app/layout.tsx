import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
  userScalable: false,
  minimumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-100`}>
        <Providers>
          <TheHeader />
          <div className="my-4 flex min-h-screen w-full justify-center md:w-auto md:min-w-96">{children}</div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
