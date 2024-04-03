import { PrismaClient } from '@prisma/client'
export abstract class BaseSeeder {
  protected _prisma: PrismaClient

  constructor() {
    this._prisma = new PrismaClient()
  }

  abstract seed(): Promise<void>
}
