'use client'

import { useState, useEffect } from 'react'
import { loginSchema } from '@/back/models/User'
import { login, LoginFormState } from '@/actions/authentication'
import useInput from '@/hooks/use-input'
import { isEqual } from 'lodash'

export default function LoginForm() {
  const [error, setError] = useState<LoginFormState>({ errors: { email: [], password: [], _form: [] } })
  const email = useInput(loginSchema.pick({ email: true }), 'email')
  const password = useInput(loginSchema.pick({ password: true }), 'password')
  const inputs = [email, password]
  const isConfirmButtonDisabled = !inputs.every((input) => input.isValid)

  useEffect(() => {
    inputs.forEach((input) => {
      if (input.hasError && !isEqual(error.errors[input.name as keyof LoginFormState['errors']], input.errors)) {
        setError((prevState) => {
          const newError = { ...prevState }
          newError.errors[input.name as keyof LoginFormState['errors']] = input.errors
          return newError
        })
      } else if (!input.hasError && error.errors[input.name as keyof LoginFormState['errors']].length) {
        setError((prevState) => {
          const newError = { ...prevState }
          newError.errors[input.name as keyof LoginFormState['errors']] = []
          return newError
        })
      }
    })
  }, [inputs, error])

  const submitHandler = async (formData: FormData) => {
    const result = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    const formattedError: LoginFormState = { errors: { email: [], password: [], _form: [] } }
    if (!result.success) {
      formattedError.errors = {
        ...formattedError.errors,
        ...result.error.flatten().fieldErrors,
      }
      setError(formattedError)
      return
    }
    setError(formattedError)
    const response = await login(result.data)
    if (response?.errors) {
      setError({ errors: response.errors })
    }
  }

  return (
    <form action={submitHandler}>
      <div>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="text"
          placeholder="email"
          name="email"
          id="email"
          value={email.value}
          onInput={email.inputHandler}
          onBlur={email.blurHandler}
        />
        {!!error.errors.email.length && <p style={{ color: 'orange' }}>{error.errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="text"
          placeholder="password"
          name="password"
          id="password"
          value={password.value}
          onInput={password.inputHandler}
          onBlur={password.blurHandler}
        />
        {!!error.errors.password.length && <p style={{ color: 'orange' }}>{error.errors.password}</p>}
      </div>
      {!!error.errors._form.length && <p style={{ color: 'red' }}>{error.errors._form}</p>}
      <button type="submit" disabled={isConfirmButtonDisabled}>
        Login
      </button>
    </form>
  )
}
