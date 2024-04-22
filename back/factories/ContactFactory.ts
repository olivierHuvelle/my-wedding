import { fakerFR_BE } from '@faker-js/faker'
import { BaseFactory } from '../factories/BaseFactory'

interface Contact {
  phone: string
  email: string
  firstName: string
  lastName: string
  remark: string
}

export class ContactFactory extends BaseFactory<Contact> {
  protected _uniqueConstraints: { email: string[] }

  constructor() {
    super()
    this._uniqueConstraints = {
      email: [],
    }
  }

  create(): Contact {
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
      phone: fakerFR_BE.phone.number(),
      email,
      firstName,
      lastName,
      remark: fakerFR_BE.lorem.text(),
    }
  }
}
