'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
interface PermissionSectionProps {
  redirectionUrl: string
}

export default function PermissionSection({ redirectionUrl }: PermissionSectionProps) {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || 'Accès refusé'
  const message = searchParams.get('message') || "Vous n'avez pas les permissions requises"

  return (
    <div className="flex flex-col">
      <h1 className="my-2 text-center text-2xl font-bold text-gray-800">{title}</h1>
      <p className="mb-6 mt-2 text-center text-gray-800">{message}</p>
      <Link
        href={redirectionUrl}
        className="mx-auto my-2 rounded  border bg-indigo-600 px-8 py-4 text-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 sm:w-full lg:w-auto"
      >
        Retour à la page principale
      </Link>
    </div>
  )
}
