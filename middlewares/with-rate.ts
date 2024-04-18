import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { CustomMiddleware } from './chain'
import paths from '@/utils/paths'

const idToRequestCount = new Map<string, number>()

const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 60000,
  maxRequests: 200,
}

const limit = (ip: string) => {
  const now = Date.now()
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize
  if (isNewWindow) {
    rateLimiter.windowStart = now
    idToRequestCount.set(ip, 0)
  }

  const currentRequestCount = idToRequestCount.get(ip) ?? 0
  if (currentRequestCount >= rateLimiter.maxRequests) return true
  idToRequestCount.set(ip, currentRequestCount + 1)

  return false
}

export default function withRate(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()

    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || request.ip || 'unknown'
    const isRateLimited = limit(ip)

    const redirectToPermissionPage = new URL(paths.permission.url, request.url)
    redirectToPermissionPage.searchParams.append('title', 'Trop de requêtes')
    redirectToPermissionPage.searchParams.append(
      'message',
      'Vous avez effectué trop de requêtes pour une fenêtre temporelle donnée',
    )
    if (request.url !== redirectToPermissionPage.toString() && isRateLimited) {
      return NextResponse.redirect(redirectToPermissionPage, { status: 302 })
    }
    return middleware(request, event, response)
  }
}
