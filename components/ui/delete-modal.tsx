'use client'

import { useState } from 'react'
import { Modal, ModalHeader, ModalFooter, ModalContent, ModalBody, Button } from '@nextui-org/react'
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

  const submitHandler = async () => {
    const response = await deleteFn(modelInstance)
    if (response.errors._form.length) {
      setError((prevError) => ({
        ...prevError,
        errors: { ...response.errors },
      }))
    } else {
      setError(createEmptyFormState())
      onOpenChange()
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{confirmationText}</p>
              {!!error.errors._form.length && (
                <Alert
                  title="Une erreur s'est produite"
                  content={error.errors._form}
                  variant="danger"
                  className="mb-2"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button color="danger" onClick={submitHandler}>
                Confirmer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
