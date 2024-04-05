'use client'

import { useState } from 'react'
import { loginSchema } from '@/back/models/User'
import { login, LoginFormState } from '@/actions/authentication'

export default function LoginForm() {
  const [error, setError] = useState<LoginFormState>({ errors: {} })

  const submitHandler = async (formData: FormData) => {
    console.log('client side validation') // TODO delete me
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
    if (response.errors) {
      setError({ errors: response.errors })
    }
  }

  return (
    <form action={submitHandler}>
      <div>
        <label htmlFor="email">Email</label>
        <br />
        <input type="text" placeholder="email" name="email" id="email" />
        {!!error.errors.email && <p style={{ color: 'orange' }}>{error.errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <br />
        <input type="text" placeholder="password" name="password" id="password" />
        {!!error.errors.password && <p style={{ color: 'orange' }}>{error.errors.password}</p>}
      </div>
      {!!error.errors._form && <p style={{ color: 'red' }}>{error.errors._form}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
