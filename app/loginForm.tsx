'use client'

import { useFormState } from 'react-dom'
import { login } from '@/actions/authentication'

export default function LoginForm() {
  const [formState, action] = useFormState(login, { errors: {} })
  return (
    <form action={action}>
      <div>
        <label htmlFor="email">Email</label>
        <br />
        <input type="text" placeholder="email" name="email" id="email" />
        {!!formState.errors.email && <p>{formState.errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <br />
        <input type="text" placeholder="password" name="password" id="password" />
        {!!formState.errors.password && <p>{formState.errors.password}</p>}
      </div>
      {!!formState.errors._form && <p>{formState.errors._form}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
