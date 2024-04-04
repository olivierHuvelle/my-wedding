import { SignJWT, jwtVerify, JWTPayload } from 'jose'

export class AuthenticationService {
  private readonly _key: Uint8Array
  private _algo: string

  constructor() {
    this._key = new TextEncoder().encode(process.env.JWT_KEY)
    this._algo = process.env.JWT_ALGO as string
  }

  async encrypt(payload: JWTPayload) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: this._algo })
      .setIssuedAt()
      .setExpirationTime('20 min from now')
      .sign(this._key)
  }

  async decrypt(input: string) {
    const { payload } = await jwtVerify(input, this._key, {
      algorithms: [this._algo],
    })
    return payload
  }
}
