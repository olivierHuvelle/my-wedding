import prisma from '@/back/database/db'
import { Role } from '@prisma/client'

export class RoleService {
  protected _prisma = prisma

  async getRoleCategoryName(role: Role) {
    let rootParent = role
    while (rootParent.parentId) {
      rootParent = await this._prisma.role.findFirstOrThrow({
        where: {
          id: rootParent.parentId,
        },
      })
    }
    return rootParent
  }

  async findAll() {
    return await this._prisma.role.findMany({})
  }
}
