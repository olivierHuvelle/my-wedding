import { fakerFR_BE } from '@faker-js/faker'
import { Menu } from '@prisma/client'
import { Guest } from '@prisma/client'

interface GuestFactoryObject {
  userId: number
  parentId?: number | undefined | null
  firstName: string
  lastName: string
  isChild: boolean
  foodProhibitions: string
  menu: Menu
  phone: string | undefined | null
  remark: string
  age?: number | undefined
}

export class GuestFactory {
  _getCommonFoodProhibitions() {
    const commonFoodProhibitions = ['porc', 'végétarien', 'cacahuète', '']
    const shuffled = commonFoodProhibitions.sort(() => 0.5 - Math.random())
    const nbElements = Math.floor(Math.random() * (commonFoodProhibitions.length + 1))
    return shuffled.slice(0, nbElements).join(', ')
  }
  createAdultForUserId(userId: number): GuestFactoryObject {
    return {
      userId,
      firstName: fakerFR_BE.person.firstName(),
      lastName: fakerFR_BE.person.lastName(),
      isChild: false,
      menu: Menu.Adult,
      foodProhibitions: this._getCommonFoodProhibitions(),
      phone: fakerFR_BE.phone.number(),
      remark: `remark for user ${userId}`,
    }
  }

  createAdultForGuest(guest: Guest) {
    return {
      userId: guest.userId,
      firstName: fakerFR_BE.person.firstName(),
      lastName: fakerFR_BE.person.lastName(),
      isChild: false,
      menu: Menu.Adult,
      foodProhibitions: this._getCommonFoodProhibitions(),
      phone: guest.phone,
      remark: '',
    }
  }

  createYoungChildForGuest(guest: Guest): GuestFactoryObject {
    return {
      userId: guest.userId,
      firstName: fakerFR_BE.person.firstName(),
      lastName: fakerFR_BE.person.lastName(),
      isChild: true,
      menu: Menu.None,
      foodProhibitions: '',
      phone: guest.phone,
      remark: '',
      age: 1,
    }
  }

  createMidAgedChildForUserId(guest: Guest): GuestFactoryObject {
    return {
      userId: guest.userId,
      firstName: fakerFR_BE.person.firstName(),
      lastName: fakerFR_BE.person.lastName(),
      isChild: true,
      menu: Menu.Child,
      foodProhibitions: '',
      phone: guest.phone,
      remark: '',
      age: 8,
    }
  }

  createOlivier(olivierUserId: number): GuestFactoryObject {
    return {
      userId: olivierUserId,
      firstName: 'Olivier',
      lastName: 'Huvelle',
      isChild: false,
      menu: Menu.Adult,
      foodProhibitions: '',
      phone: '0494910885',
      remark: '',
    }
  }

  createLaurie(laurieUserId: number): GuestFactoryObject {
    return {
      userId: laurieUserId,
      firstName: 'Laurie',
      lastName: 'Swenen',
      isChild: false,
      menu: Menu.Adult,
      foodProhibitions: 'Crevettes',
      phone: '0494244797',
      remark: '',
    }
  }
}
