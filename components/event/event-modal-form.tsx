'use client'

import { useState, useMemo, useRef } from 'react'
import useInput from '@/hooks/use-input'
import { Modal, ModalHeader, ModalFooter, ModalContent, ModalBody, Button, Input, Spinner } from '@nextui-org/react'
import Alert from '@/components/ui/alert'
import toast from 'react-hot-toast'
import { EventCreateInput } from '@/back/models/Event'
import { createEvent } from '@/actions/event'

interface EventModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onClose: () => void
}

export default function EventModalForm({ isOpen, onOpenChange, onClose }: EventModalProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const name = useInput(EventCreateInput.pick({ name: true }), 'name', '')
  const city = useInput(EventCreateInput.pick({ city: true }), 'city', '')
  const number = useInput(EventCreateInput.pick({ number: true }), 'number', '')
  const street = useInput(EventCreateInput.pick({ street: true }), 'street', '')
  const zipCode = useInput(EventCreateInput.pick({ zipCode: true }), 'zipCode', '')
  const startingAt = useInput(EventCreateInput.pick({ startingAt: true }), 'startingAt', '', (value) => new Date(value))
  const endingAt = useInput(EventCreateInput.pick({ endingAt: true }), 'endingAt', '', (value) => new Date(value))

  const inputs = useMemo(
    () => [name, city, number, street, zipCode, startingAt, endingAt],
    [name, city, number, street, zipCode, startingAt, endingAt],
  )

  const isConfirmButtonDisabled = inputs.some((input) => input.hasError) || isLoading

  const reset = () => {
    setFormErrors([])
    inputs.forEach((input) => input.reset())
  }

  const onCloseHandler = () => {
    inputs.forEach((input) => input.reset())
    onClose()
  }

  const submitHandler = async (formData: FormData) => {
    if (isLoading) {
      return
    }

    const data = {
      name: formData.get('name'),
      city: formData.get('city'),
      number: formData.get('number'),
      zipCode: formData.get('zipCode'),
      street: formData.get('street'),
      startingAt: new Date(formData.get('startingAt') as string | Date),
      endingAt: new Date(formData.get('endingAt') as string | Date),
    }
    const result = EventCreateInput.safeParse(data)

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

    const response = await createEvent(result.data)

    setTimeout(() => {
      setIsLoading(false)
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
        toast.success("L'événement a bien été créé")
        onOpenChange()
      }
    }, 1000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      size="xl"
      scrollBehavior="inside"
      onClose={onCloseHandler}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Ajouter un événement</ModalHeader>
            <ModalBody>
              {!isLoading && (
                <form action={submitHandler} ref={formRef}>
                  <Input
                    name="name"
                    label="Nom"
                    placeholder="Exemple"
                    isRequired={true}
                    value={name.value}
                    onInput={name.inputHandler}
                    onBlur={name.blurHandler}
                    isInvalid={name.hasError}
                    errorMessage={name.errors}
                  />
                  <Input
                    name="city"
                    label="Ville"
                    placeholder="Arlon"
                    isRequired={true}
                    value={city.value}
                    onBlur={city.blurHandler}
                    onInput={city.inputHandler}
                    isInvalid={city.hasError}
                    errorMessage={city.errors}
                  />
                  <Input
                    name="number"
                    label="Numéro"
                    placeholder="1"
                    isRequired={true}
                    value={number.value}
                    onBlur={number.blurHandler}
                    onInput={number.inputHandler}
                    isInvalid={number.hasError}
                    errorMessage={number.errors}
                  />
                  <Input
                    name="street"
                    label="Rue"
                    placeholder="1"
                    isRequired={true}
                    value={street.value}
                    onBlur={street.blurHandler}
                    onInput={street.inputHandler}
                    isInvalid={street.hasError}
                    errorMessage={street.errors}
                  />
                  <Input
                    name="zipCode"
                    label="Code postal"
                    placeholder="6740"
                    isRequired={true}
                    value={zipCode.value}
                    onBlur={zipCode.blurHandler}
                    onInput={zipCode.inputHandler}
                    isInvalid={zipCode.hasError}
                    errorMessage={zipCode.errors}
                  />
                  <Input
                    name="startingAt"
                    label="Début"
                    type="datetime-local"
                    isRequired={true}
                    classNames={{
                      label: '-mt-4',
                    }}
                    value={startingAt.value}
                    onBlur={startingAt.blurHandler}
                    onInput={startingAt.inputHandler}
                    isInvalid={startingAt.hasError}
                    errorMessage={startingAt.errors}
                  />
                  <Input
                    name="endingAt"
                    label="Fin"
                    type="datetime-local"
                    isRequired={true}
                    classNames={{
                      label: '-mt-4',
                    }}
                    value={endingAt.value}
                    onBlur={endingAt.blurHandler}
                    onInput={endingAt.inputHandler}
                    isInvalid={endingAt.hasError}
                    errorMessage={endingAt.errors}
                  />
                  {!!formErrors.length && (
                    <Alert title="Une erreur s'est produite" content={formErrors} variant="danger" className="my-2" />
                  )}
                </form>
              )}
              {isLoading && <Spinner />}
            </ModalBody>

            <ModalFooter>
              {!isLoading && (
                <>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Fermer
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      formRef.current && formRef.current.requestSubmit()
                    }}
                    isDisabled={isConfirmButtonDisabled}
                  >
                    Valider
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
