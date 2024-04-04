import { cookies } from 'next/headers'
import { AuthenticationService } from '@/back/services/AuthenticationService'
import { NextRequest, NextResponse } from 'next/server'

export class SessionService {
  private _authenticationService: AuthenticationService
  constructor() {
    this._authenticationService = new AuthenticationService()
  }

  async setSession(session: string, expires: Date) {
    cookies().set('session', session, {
      expires,
      httpOnly: true,
    })
  }

  async getSession() {
    const session = cookies().get('session')?.value
    if (!session) {
      return null
    }
    return await this._authenticationService.decrypt(session)
  }

  async updateSessionExpirationFromRequest(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    if (!session) {
      return
    }
    const parsedSession = await this._authenticationService.decrypt(session)
    parsedSession.expires = new Date(Date.now() + 20 * 60 * 1000)
    const response = NextResponse.next()

    response.cookies.set({
      name: 'session',
      value: await this._authenticationService.encrypt(parsedSession),
      httpOnly: true,
      expires: parsedSession.exp,
    })

    return response
  }
}
