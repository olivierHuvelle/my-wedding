import { compareSync } from 'bcrypt'
import prisma from '@/back/database/db'

export class IncorrectPasswordError extends Error {
  constructor() {
    super('invalid password')
    this.name = 'IncorrectPasswordError'
  }
}
export class UserService {
  protected _prisma = prisma

  async findUserByEmailAndPassword(email: string, password: string) {
    const user = await this._prisma.user.findFirstOrThrow({
      where: {
        email,
      },
      include: {
        role: true,
      },
    })
    const isPasswordValid = compareSync(password, user.password)
    if (!isPasswordValid) {
      throw new IncorrectPasswordError()
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role.name,
    }
  }
}
