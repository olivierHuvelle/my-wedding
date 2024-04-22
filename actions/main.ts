export interface BaseFormState {
  errors: {
    _form: string[]
  }
}

export interface EventFormState extends BaseFormState {
  errors: {
    name: string[]
    city: string[]
    number: string[]
    street: string[]
    zipCode: string[]
    startingAt: string[]
    endingAt: string[]
    _form: string[]
  }
}

export interface GuestFormState extends BaseFormState {
  errors: {
    firstName: string[]
    lastName: string[]
    isChild: string[]
    foodProhibitions: string[]
    menu: string[]
    phone: string[]
    remark: string[]
    age: string[]
    _form: string[]
  }
}

export interface UserFormState extends BaseFormState {
  errors: {
    identifier: string[]
    password: string[]
    _form: string[]
  }
}

export interface MarriedUserFormState extends BaseFormState {
  errors: {
    roleId: string[]
    identifier: string[]
    password: string[]
    _form: string[]
  }
}

export interface ContactFormState extends BaseFormState {
  errors: {
    phone: string[]
    email: string[]
    job: string[]
    firstName: string[]
    lastName: string[]
    remark: string[]
    _form: string[]
  }
}

export function createEmptyFormState(): BaseFormState {
  return {
    errors: {
      _form: [],
    },
  }
}

export function createEmptyEventFormState(): EventFormState {
  return {
    errors: {
      name: [],
      city: [],
      number: [],
      street: [],
      zipCode: [],
      startingAt: [],
      endingAt: [],
      _form: [],
    },
  }
}

export function createEmptyGuestFormState(): GuestFormState {
  return {
    errors: {
      firstName: [],
      lastName: [],
      isChild: [],
      foodProhibitions: [],
      menu: [],
      phone: [],
      remark: [],
      age: [],
      _form: [],
    },
  }
}

export function createEmptyUserFormState(): UserFormState {
  return {
    errors: {
      identifier: [],
      password: [],
      _form: [],
    },
  }
}

export function createEmptyContactFormState(): ContactFormState {
  return {
    errors: {
      phone: [],
      email: [],
      job: [],
      firstName: [],
      lastName: [],
      remark: [],
      _form: [],
    },
  }
}

export function createEmptyMarriedUserFormState(): MarriedUserFormState {
  return {
    errors: {
      roleId: [],
      identifier: [],
      password: [],
      _form: [],
    },
  }
}
