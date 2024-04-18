import { fakerFR_BE } from '@faker-js/faker'
import { BaseFactory } from '../factories/BaseFactory'
import { hashSync } from 'bcrypt'

interface User {
  roleId: number
  identifier: string
  password: string
  confirmedAt: Date
}

export class UserFactory extends BaseFactory<User> {
  protected _uniqueConstraints: { identifier: string[] }
  private roleIds: number[]

  constructor(roleIds: number[]) {
    super()
    this._uniqueConstraints = {
      identifier: [],
    }
    this.roleIds = roleIds
  }

  create(): User {
    let identifier = ''
    let firstName = ''
    let lastName = ''
    do {
      firstName = fakerFR_BE.person.firstName()
      lastName = fakerFR_BE.person.lastName()
      identifier = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`
    } while (this._uniqueConstraints.identifier.includes(identifier))
    this._uniqueConstraints.identifier.push(identifier)

    return {
      roleId: this.roleIds[Math.floor(Math.random() * this.roleIds.length)],
      identifier,
      password: hashSync('password', 10),
      confirmedAt: new Date(),
    }
  }

  createOlivier(marriedRoleId: number): User {
    const identifier = 'olivier.huvelle@gmail.com'
    return {
      roleId: marriedRoleId,
      identifier,
      password: hashSync('password', 10),
      confirmedAt: new Date(),
    }
  }

  createLaurie(marriedRoleId: number): User {
    const identifier = 'laurie.swenen@gmail.com'
    return {
      roleId: marriedRoleId,
      identifier,
      password: hashSync('password', 10),
      confirmedAt: new Date(),
    }
  }
}
