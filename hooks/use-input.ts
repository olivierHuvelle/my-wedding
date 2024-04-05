import { ChangeEvent, useState } from 'react'
import { ZodSchema } from 'zod'

const useInput = (schema: ZodSchema, schemaKey: string, defaultValue = '') => {
  const [enteredValue, setEnteredValue] = useState(defaultValue)
  const [hadFocus, setHadFocus] = useState(!!enteredValue)
  let errors: string[] = []
  let isValueValid = false
  const result = schema.safeParse({ [schemaKey]: enteredValue })

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
    value: enteredValue,
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
