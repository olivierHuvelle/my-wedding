import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'
import { CustomMiddleware } from './chain'

const protectedPaths = ['/married', '/guest']

export default function withAuthMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // Create a response object to pass down the chain
    const response = NextResponse.next()

    const token = await getToken({ req: request })

    // @ts-expect-error Some message
    request.nextauth = request.nextauth || {}
    // @ts-expect-error Some other message
    request.nextauth.token = token
    const pathname = request.nextUrl.pathname

    if (!token && protectedPaths.includes(pathname)) {
      const signInUrl = new URL('/api/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    return middleware(request, event, response)
  }
}
