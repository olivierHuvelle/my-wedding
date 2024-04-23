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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
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
