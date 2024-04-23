'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import useInput from '@/hooks/use-input'
import { loginSchema } from '@/back/models/User'
import { Input, Button, Spinner } from '@nextui-org/react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import Alert from '@/components/ui/alert'
import paths from '@/utils/paths'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const identifierFromUrl = searchParams.get('identifier') || ''
  const passwordFromUrl = searchParams.get('password') || ''

  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const identifier = useInput(loginSchema.pick({ identifier: true }), 'identifier', identifierFromUrl)
  const password = useInput(loginSchema.pick({ password: true }), 'password', passwordFromUrl)
  const inputs = useMemo(() => [identifier, password], [identifier, password])
  const isConfirmButtonDisabled = inputs.some((input) => input.hasError) || isLoading

  const toggleVisibilityHandler = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const submitHandler = async (formData: FormData) => {
    if (isLoading) {
      return
    }

    const result = loginSchema.safeParse({
      identifier: formData.get('identifier'),
      password: formData.get('password'),
    })

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      const keys = Object.keys(errors) as (keyof typeof errors)[]
      for (const key of keys) {
        const input = inputs.find((input) => input.name === key)
        if (input) {
          input.setServerErrors(errors[key]!)
        }
      }
      return
    }

    setIsLoading(true)

    const response = await signIn('credentials', {
      identifier: result.data.identifier,
      password: result.data.password,
      redirect: false,
    })

    setTimeout(() => {
      setIsLoading(false)
      if (response?.error) {
        const errorMessage =
          response.error === 'CredentialsSignin' ? 'Identifiants invalides' : "Une erreur s'est produite"
        setFormErrors([errorMessage])
      } else {
        setFormErrors([])
        router.push(paths.guest.url)
        router.refresh()
      }
    }, 1000)
  }

  return (
    <>
      {!isLoading && (
        <form action={submitHandler}>
          <Input
            name="identifier"
            label="Identifiant"
            placeholder="john.doe@gmail.com"
            isRequired={true}
            value={identifier.value}
            onInput={identifier.inputHandler}
            onBlur={identifier.blurHandler}
            isInvalid={identifier.hasError}
            errorMessage={identifier.errors}
            autoComplete="on"
          />
          <Input
            name="password"
            label="Mot de passe"
            placeholder="secret"
            isRequired={true}
            value={password.value}
            type={isPasswordVisible ? 'text' : 'password'}
            onInput={password.inputHandler}
            onBlur={password.blurHandler}
            isInvalid={password.hasError}
            errorMessage={password.errors}
            autoComplete="on"
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibilityHandler}>
                {isPasswordVisible ? (
                  <FaRegEye className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <FaRegEyeSlash className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
          />

          {!!formErrors.length && (
            <Alert title="Une erreur s'est produite" content={formErrors} variant="danger" className="my-2" />
          )}

          <Button isDisabled={isConfirmButtonDisabled} type="submit" color="success" variant="flat" className="w-full">
            Se connecter
          </Button>
        </form>
      )}
      {isLoading && <Spinner />}
    </>
  )
}
