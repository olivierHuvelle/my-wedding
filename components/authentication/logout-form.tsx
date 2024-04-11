'use client'

import { FormEvent } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@nextui-org/react'
import paths from '@/utils/paths'

export default function LogoutForm() {
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await signOut({ callbackUrl: paths.login.url })
  }

  return (
    <form onSubmit={submitHandler}>
      <Button type="submit" color="danger" variant="light">
        Déconnexion
      </Button>
    </form>
  )
}
