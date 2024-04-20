'use client'

import { useState, useMemo, ChangeEvent } from 'react'
import useInput from '@/hooks/use-input'
import { loginSchema } from '@/back/models/User'
import { Input, Button } from '@nextui-org/react'
import Alert from '@/components/ui/alert'
import { User } from '@prisma/client'
import { updateUser } from '@/actions/user'
import toast from 'react-hot-toast'
import paths from '@/utils/paths'
import { redirect } from 'next/navigation'

interface ProfileFormProps {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [formErrors, setFormErrors] = useState<string[]>([])
  const identifier = useInput(loginSchema.pick({ identifier: true }), 'identifier', user.identifier)
  const password = useInput(loginSchema.pick({ password: true }), 'password')
  const inputs = useMemo(() => [identifier, password], [identifier, password])

  const confirmIdentifierErrorMessage = "La confirmation de l'identifiant doit être égal à l'identifiant"
  const confirmPasswordErrorMessage = 'La confirmation du mot de passe doit être égal au mot de passe'
  const [confirmIdentifierHadFocus, setConfirmIdentifierHadFocus] = useState(false)
  const [confirmIdentifierValue, setConfirmIdentifierValue] = useState('')
  const [confirmIdentifierError, setConfirmIdentifierError] = useState(confirmIdentifierErrorMessage)

  const [confirmPasswordHadFocus, setConfirmPasswordHadFocus] = useState(false)
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState(confirmPasswordErrorMessage)

  const isConfirmButtonDisabled =
    inputs.some((input) => input.hasError) || confirmPasswordError.length > 0 || confirmIdentifierError.length > 0

  const confirmIdentifierInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmIdentifierValue(e.target.value.trim())
    if (e.target.value.trim() !== identifier.value) {
      setConfirmIdentifierError(confirmIdentifierErrorMessage)
    } else {
      setConfirmIdentifierError('')
    }
  }

  const confirmPasswordInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPasswordValue(e.target.value.trim())
    if (e.target.value.trim() !== password.value) {
      setConfirmPasswordError(confirmPasswordErrorMessage)
    } else {
      setConfirmPasswordError('')
    }
  }

  const reset = () => {
    setFormErrors([])
    inputs.forEach((input) => input.setServerErrors([]))
  }

  const submitHandler = async (formData: FormData) => {
    const data = {
      password: formData.get('password'),
      identifier: formData.get('identifier'),
    }

    const result = loginSchema.safeParse(data)
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

    const response = await updateUser(user, result.data)

    let hasResponseError = false
    const keys = Object.keys(response.errors) as (keyof typeof response.errors)[]
    for (const key of keys) {
      const input = inputs.find((input) => input.name === key)
      if (input && response.errors[key].length) {
        input.setServerErrors(response.errors[key])
        hasResponseError = true
      }
    }
    if (response.errors._form.length) {
      setFormErrors(response.errors._form)
      hasResponseError = true
    }

    if (!hasResponseError) {
      reset()
      toast.success('Le profil a bien été mis à jour')
      redirect(paths.guest.url)
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
        name="identifierConfirm"
        label="Confirmation identifiant"
        placeholder="john.doe@gmail.com"
        isRequired={true}
        value={confirmIdentifierValue}
        onInput={confirmIdentifierInputHandler}
        onBlur={() => {
          setConfirmIdentifierHadFocus(true)
        }}
        isInvalid={confirmIdentifierHadFocus && confirmIdentifierError.length > 0}
        errorMessage={confirmIdentifierHadFocus && confirmIdentifierError.length > 0 ? confirmIdentifierError : ''}
        autoComplete="on"
        className="mb-2"
      />

      <Input
        name="password"
        label="Mot de passe"
        placeholder="secret"
        isRequired={true}
        value={password.value}
        onInput={password.inputHandler}
        onBlur={password.blurHandler}
        isInvalid={password.hasError}
        errorMessage={password.errors}
        autoComplete="on"
      />

      <Input
        name="passwordConfirm"
        label="Confirmation mot de passe"
        placeholder="secret"
        isRequired={true}
        value={confirmPasswordValue}
        onInput={confirmPasswordInputHandler}
        onBlur={() => {
          setConfirmPasswordHadFocus(true)
        }}
        isInvalid={confirmPasswordHadFocus && confirmPasswordError.length > 0}
        errorMessage={confirmPasswordHadFocus && confirmPasswordError.length > 0 ? confirmPasswordError : ''}
        autoComplete="on"
        className="mb-2"
      />

      {!!formErrors.length && (
        <Alert title="Une erreur s'est produite" content={formErrors} variant="danger" className="my-2" />
      )}

      <Button disabled={isConfirmButtonDisabled} type="submit" color="success" variant="flat" className="w-full">
        Changer le profil
      </Button>
    </form>
  )
}
