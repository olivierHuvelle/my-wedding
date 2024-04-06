'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@nextui-org/react'
import { FormEvent } from 'react'

export default function LogoutForm() {
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <form onSubmit={submitHandler}>
      <Button type="submit" color="danger" variant="bordered">
        Se déconnecter
      </Button>
    </form>
  )
}
