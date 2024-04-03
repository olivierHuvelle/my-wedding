import { fakerFR_BE } from '@faker-js/faker'

interface Contact {
  phone: string
  email: string
  firstName: string
  lastName: string
  zipCode: string
  number: string
  street: string
  city: string
  remark: string
}

export class ContactFactory {
  private _uniqueConstraints: { email: string[] }

  constructor() {
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
      zipCode: fakerFR_BE.location.zipCode(),
      number: fakerFR_BE.location.buildingNumber(),
      street: fakerFR_BE.location.street(),
      city: fakerFR_BE.location.city(),
      remark: fakerFR_BE.lorem.text(),
    }
  }

  bulkCreate(nbRecords: number) {
    const records = []
    for (let i = 0; i < nbRecords; i++) {
      records.push(this.create())
    }
    return records
  }
}
