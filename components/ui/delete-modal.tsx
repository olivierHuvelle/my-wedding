'use client'

import { useState } from 'react'
import { Modal, ModalHeader, ModalFooter, ModalContent, ModalBody, Button, Spinner } from '@nextui-org/react'
import Alert from '@/components/ui/alert'
import { BaseFormState, createEmptyFormState } from '@/actions/main'

interface DeleteModalFormProps<T> {
  title: string
  confirmationText: string
  isOpen: boolean
  onOpenChange: () => void
  // eslint-disable-next-line no-unused-vars
  deleteFn: (modelInstance: T) => Promise<BaseFormState>
  modelInstance: T
}

export default function DeleteModal<T>({
  title,
  confirmationText,
  isOpen,
  onOpenChange,
  deleteFn,
  modelInstance,
}: DeleteModalFormProps<T>) {
  const [error, setError] = useState<BaseFormState>(createEmptyFormState())
  const [isLoading, setIsLoading] = useState(false)

  const submitHandler = async () => {
    setIsLoading(true)
    const response = await deleteFn(modelInstance)
    setTimeout(() => {
      setIsLoading(false)
      if (response.errors._form.length) {
        setError((prevError) => ({
          ...prevError,
          errors: { ...response.errors },
        }))
      } else {
        setError(createEmptyFormState())
        onOpenChange()
      }
    }, 1000)
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              {!isLoading && (
                <>
                  <p>{confirmationText}</p>
                  {!!error.errors._form.length && (
                    <Alert
                      title="Une erreur s'est produite"
                      content={error.errors._form}
                      variant="danger"
                      className="mb-2"
                    />
                  )}
                </>
              )}
              {isLoading && <Spinner />}
            </ModalBody>
            <ModalFooter>
              {!isLoading && (
                <>
                  <Button color="primary" variant="light" onPress={onClose}>
                    Annuler
                  </Button>
                  <Button color="danger" onClick={submitHandler}>
                    Confirmer
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
