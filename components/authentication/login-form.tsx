'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import useInput from '@/hooks/use-input'
import { loginSchema } from '@/back/models/User'
import { Input, Button } from '@nextui-org/react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import Alert from '@/components/ui/alert'
import paths from '@/utils/paths'

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const identifier = useInput(loginSchema.pick({ identifier: true }), 'identifier')
  const password = useInput(loginSchema.pick({ password: true }), 'password')
  const inputs = useMemo(() => [identifier, password], [identifier, password])
  const isConfirmButtonDisabled = inputs.some((input) => input.hasError)

  const router = useRouter()

  const toggleVisibilityHandler = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const submitHandler = async (formData: FormData) => {
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

    const response = await signIn('credentials', {
      identifier: result.data.identifier,
      password: result.data.password,
      redirect: false,
    })

    if (response?.error) {
      const errorMessage =
        response.error === 'CredentialsSignin' ? 'Identifiants invalides' : "Une erreur s'est produite"
      setFormErrors([errorMessage])
    } else {
      setFormErrors([])
      router.push(paths.guest.url)
      router.refresh()
    }
  }

  return (
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

      <Button disabled={isConfirmButtonDisabled} type="submit" color="success" variant="flat" className="w-full">
        Se connecter
      </Button>
    </form>
  )
}
