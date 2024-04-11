import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { CustomMiddleware } from './chain'
import paths from '@/utils/paths'

export default function withRoleMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()
    const token = await getToken({ req: request })

    // @ts-expect-error Some message
    request.nextauth = request.nextauth || {}

    // @ts-expect-error Some other message
    request.nextauth.token = token

    const tokenRoleCategory = token?.user?.roleCategory

    for (const key in paths) {
      if (Object.hasOwnProperty.call(paths, key)) {
        // @ts-expect-error We know that the key matches
        const path = paths[key]
        const pathName = path.url

        if (
          request.nextUrl.pathname === pathName &&
          path.roleCategories.length &&
          !path.roleCategories.includes(tokenRoleCategory)
        ) {
          return NextResponse.redirect(new URL(paths.permission.url, request.url), { status: 302 })
        }
      }
    }

    return middleware(request, event, response)
  }
}
