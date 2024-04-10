import { compareSync } from 'bcrypt'
import prisma from '@/back/database/db'
import { RoleService } from '@/back/services/RoleService'

export class IncorrectPasswordError extends Error {
  constructor() {
    super('invalid password')
    this.name = 'IncorrectPasswordError'
  }
}
export class UserService {
  protected _prisma = prisma

  async findUserByEmailAndPassword(email: string, password: string) {
    const roleService = new RoleService()
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

    const parentRole = await roleService.getRoleCategoryName(user.role)

    return {
      id: user.id,
      email: user.email,
      roleCategory: parentRole.name,
    }
  }
}
