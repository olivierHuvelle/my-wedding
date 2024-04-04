import prisma from '../database/db'

export abstract class BaseSeeder {
  protected _prisma = prisma

  abstract seed(): Promise<void>
}
