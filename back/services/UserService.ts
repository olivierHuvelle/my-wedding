import { compareSync } from 'bcrypt'
import prisma from '@/back/database/db'
import { RoleService } from '@/back/services/RoleService'
import { Prisma } from '@prisma/client'
import { hashSync } from 'bcrypt'

export interface UserSession {
  id: number
  identifier: string
  roleCategory: string
}

export class IncorrectPasswordError extends Error {
  constructor() {
    super('invalid password')
    this.name = 'IncorrectPasswordError'
  }
}

export class UserService {
  protected _prisma = prisma

  async getUser(id: number) {
    return await this._prisma.user.findFirstOrThrow({
      where: { id },
    })
  }

  async findUserByIdentifierAndPassword(identifier: string, password: string): Promise<UserSession> {
    const roleService = new RoleService()
    const user = await this._prisma.user.findFirstOrThrow({
      where: {
        identifier,
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
      identifier: user.identifier,
      roleCategory: parentRole.name,
    }
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    data.password = hashSync(data.password as string, 10)
    return await this._prisma.user.update({
      where: { id },
      data,
    })
  }
}
