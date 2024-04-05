'use client'

import { useState, useEffect } from 'react'
import useInput from '@/hooks/use-input'
import { isEqual } from 'lodash'
import { loginSchema } from '@/back/models/User'
import { login, LoginFormState } from '@/actions/authentication'
import { Input, Button } from '@nextui-org/react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import Alert from '@/components/ui/alert'

export default function LoginForm() {
  const [error, setError] = useState<LoginFormState>({ errors: { email: [], password: [], _form: [] } })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
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

  const toggleVisibilityHandler = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

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
      <Input
        name="email"
        label="Email"
        placeholder="john.doe@gmail.com"
        isRequired={true}
        value={email.value}
        onInput={email.inputHandler}
        onBlur={email.blurHandler}
        isInvalid={!!error.errors.email.length}
        errorMessage={error.errors.email}
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
        isInvalid={!!error.errors.password.length}
        errorMessage={error.errors.password}
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

      {!!error.errors._form.length && (
        <Alert title="Une erreur s'est produite" content={error.errors._form} variant="danger" className="mb-2" />
      )}

      <Button type="submit" color="success" variant="flat" disabled={isConfirmButtonDisabled} className="w-full">
        Se connecter
      </Button>
    </form>
  )
}
