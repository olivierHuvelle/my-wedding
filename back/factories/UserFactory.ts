import { fakerFR_BE } from '@faker-js/faker'
import { BaseFactory } from '../factories/BaseFactory'
import { hashSync } from 'bcrypt'

interface User {
  roleId: number
  email: string
  password: string
  confirmedAt: Date
}

export class UserFactory extends BaseFactory<User> {
  protected _uniqueConstraints: { email: string[] }
  private roleIds: number[]

  constructor(roleIds: number[]) {
    super()
    this._uniqueConstraints = {
      email: [],
    }
    this.roleIds = roleIds
  }

  create(): User {
    let email = ''
    let firstName = ''
    let lastName = ''
    do {
      firstName = fakerFR_BE.person.firstName()
      lastName = fakerFR_BE.person.lastName()
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`
    } while (this._uniqueConstraints.email.includes(email))
    this._uniqueConstraints.email.push(email)

    return {
      roleId: this.roleIds[Math.floor(Math.random() * this.roleIds.length)],
      email,
      password: hashSync('password', 10),
      confirmedAt: new Date(),
    }
  }

  createOlivier(marriedRoleId: number): User {
    const email = 'olivier.huvelle@gmail.com'
    return {
      roleId: marriedRoleId,
      email,
      password: hashSync('password', 10),
      confirmedAt: new Date(),
    }
  }

  createLaurie(marriedRoleId: number): User {
    const email = 'laurie.swenen@gmail.com'
    return {
      roleId: marriedRoleId,
      email,
      password: hashSync('password', 10),
      confirmedAt: new Date(),
    }
  }
}
