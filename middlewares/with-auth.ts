import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { CustomMiddleware } from './chain'
import paths from '@/utils/paths'

export default function withAuthMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()
    const token = await getToken({ req: request })

    // @ts-expect-error Some message
    request.nextauth = request.nextauth || {}

    // @ts-expect-error Some other message
    request.nextauth.token = token

    const pathname = request.nextUrl.pathname

    const authenticatedURLs = Object.values(paths)
      .filter((value) => value.isAuthenticated)
      .map((value) => value.url)

    // check if authenticated
    if (!token && authenticatedURLs.includes(pathname)) {
      const signInUrl = new URL(paths.signIn.url, request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    return middleware(request, event, response)
  }
}
