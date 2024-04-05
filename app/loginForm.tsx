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

  useEffect(() => {
    // [IMP] refactore me => this is way too long ...
    if (email.hasError && !isEqual(error.errors.email, email.errors)) {
      setError((prevState) => {
        const newError = { ...prevState }
        newError.errors.email = email.errors
        return newError
      })
    } else if (!email.hasError && error.errors.email?.length) {
      setError((prevState) => {
        const newError = { ...prevState }
        newError.errors.email = email.errors
        return newError
      })
    }
    if (password.hasError && !isEqual(error.errors.password, password.errors)) {
      setError((prevState) => {
        const newError = { ...prevState }
        newError.errors.password = password.errors
        return newError
      })
    } else if (!password.hasError && error.errors.password?.length) {
      setError((prevState) => {
        const newError = { ...prevState }
        newError.errors.password = password.errors
        return newError
      })
    }
  }, [email, error.errors.email, error.errors.password, password])

  const submitHandler = async (formData: FormData) => {
    const result = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!result.success) {
      setError({ errors: result.error.flatten().fieldErrors })
      return
    }
    setError({ errors: {} })
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
        {!!error.errors.email?.length && <p style={{ color: 'orange' }}>{error.errors.email}</p>}
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
        {!!error.errors.password?.length && <p style={{ color: 'orange' }}>{error.errors.password}</p>}
      </div>
      {!!error.errors._form?.length && <p style={{ color: 'red' }}>{error.errors._form}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
