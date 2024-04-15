export interface BaseFormState {
  errors: {
    _form: string[]
  }
}

export interface LoginFormState extends BaseFormState {
  errors: {
    email: string[]
    password: string[]
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
    zipCode: string[]
    number: string[]
    phone: string[]
    city: string[]
    remark: string[]
    street: string[]
    _form: string[]
  }
}
