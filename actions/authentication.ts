'use server'
import { BaseFormState } from '@/actions/main'

export interface LoginFormState extends BaseFormState {
  errors: {
    email: string[]
    password: string[]
    _form: string[]
  }
}
