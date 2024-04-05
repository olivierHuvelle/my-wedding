import { type NextFetchEvent, type NextRequest } from 'next/server'

import { CustomMiddleware } from './chain'
import { SessionService } from '@/back/services/SessionService'

export function withUpdateSession(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const sessionService = new SessionService()
    const response = await sessionService.updateSessionExpirationFromRequest(request)
    return middleware(request, event, response)
  }
}
