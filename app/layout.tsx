import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/app/providers'
import { getServerSession } from 'next-auth'
import './globals.css'
import LogoutForm from '@/components/authentication/logout-form'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Laurie et Olivier se marient',
  description: 'My Wedding - Olivier et Laurie',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()
  return (
    <html lang="fr">
      <body className={`flex h-screen items-center justify-center bg-gray-100 ${inter.className}`}>
        <Providers>
          {!!session && <LogoutForm />}
          {children}
        </Providers>
      </body>
    </html>
  )
}
