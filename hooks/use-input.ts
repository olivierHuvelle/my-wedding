import { ChangeEvent, useState } from 'react'
import { ZodSchema } from 'zod'

type BeforeValidationFunction = (value: string) => unknown
type AfterValidationFunction = (value: unknown) => string

const useInput = (
  schema: ZodSchema,
  schemaKey: string,
  defaultValue = '',
  beforeValidationFn?: BeforeValidationFunction,
  afterValidation?: AfterValidationFunction,
) => {
  const [enteredValue, setEnteredValue] = useState(defaultValue)
  const [hadFocus, setHadFocus] = useState(!!enteredValue)
  let errors: string[] = []
  let isValueValid = false
  const result = schema.safeParse({ [schemaKey]: beforeValidationFn ? beforeValidationFn(enteredValue) : enteredValue })

  if (result.success) {
    isValueValid = true
  } else {
    errors = result.error.errors.map((issue) => issue.message)
  }

  const hasError = !isValueValid && hadFocus

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredValue(event.target.value)
  }

  const blurHandler = () => {
    setHadFocus(true)
  }

  const reset = () => {
    setEnteredValue(defaultValue)
    setHadFocus(false)
  }

  return {
    name: schemaKey,
    value: afterValidation ? afterValidation(enteredValue) : enteredValue,
    isValid: isValueValid,
    hadFocus,
    hasError,
    errors,
    inputHandler,
    blurHandler,
    reset,
  }
}

export default useInput
