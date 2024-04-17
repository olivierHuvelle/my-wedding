import { ChangeEvent, useState } from 'react'
import { ZodSchema } from 'zod'

// eslint-disable-next-line no-unused-vars
type BeforeValidationFunction = (value: string) => unknown
// eslint-disable-next-line no-unused-vars
type AfterValidationFunction = (value: unknown) => string

const useInput = (
  schema: ZodSchema,
  schemaKey: string,
  defaultValue = '',
  beforeValidationFn?: BeforeValidationFunction,
  afterValidationFn?: AfterValidationFunction,
) => {
  const [enteredValue, setEnteredValue] = useState(defaultValue)
  const [hadFocus, setHadFocus] = useState(!!enteredValue)
  const [serverErrors, setServerErrors] = useState<string[]>([])

  let errors: string[] = [...serverErrors]
  let isValueValid = false
  const result = schema.safeParse({ [schemaKey]: beforeValidationFn ? beforeValidationFn(enteredValue) : enteredValue })

  if (result.success) {
    if (errors.length === 0) {
      isValueValid = true
    }
  } else {
    errors = [...errors, ...result.error.errors.map((issue) => issue.message)]
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
    value: afterValidationFn ? afterValidationFn(enteredValue) : enteredValue,
    errors: hasError ? errors : [],
    hasError,
    inputHandler,
    blurHandler,
    reset,
    setServerErrors,
    setEnteredValue,
  }
}

export default useInput
