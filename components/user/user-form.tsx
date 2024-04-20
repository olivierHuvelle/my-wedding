'use client'

import { useState, useMemo, useRef, ChangeEvent } from 'react'
import useInput from '@/hooks/use-input'
import {
  Modal,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalBody,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react'

import { User, Role } from '@prisma/client'
import { UserCreateInput } from '@/back/models/User'
import Alert from '@/components/ui/alert'
import { createUser, marriedUpdateUser } from '@/actions/user'
import toast from 'react-hot-toast'

interface UserFormProps {
  user?: User
  roles: Role[]
  isOpen: boolean
  onOpenChange: () => void
  onClose: () => void
}

export default function UserForm({ user, roles, isOpen, onOpenChange, onClose }: UserFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const identifier = useInput(UserCreateInput.pick({ identifier: true }), 'identifier', user?.identifier ?? '')
  const password = useInput(UserCreateInput.pick({ password: true }), 'password', '')
  const [selectedRole, setSelectedRole] = useState(user?.roleId ? `${user.roleId}` : '')

  const inputs = useMemo(() => [identifier, password], [identifier, password])

  const isConfirmButtonDisabled = inputs.some((input) => input.hasError) || selectedRole === ''

  const roleChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value)
  }

  const onCloseHandler = () => {
    inputs.forEach((input) => input.reset())
    setSelectedRole(user?.roleId ? `${user.roleId}` : '')
    onClose()
  }

  const submitHandler = async (formData: FormData) => {
    const data = {
      identifier: formData.get('identifier'),
      password: formData.get('password'),
      roleId: parseInt(selectedRole),
    }
    const result = UserCreateInput.safeParse(data)
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

    const response = user ? await marriedUpdateUser(user, result.data) : await createUser(result.data)

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
      inputs.forEach((input) => {
        input.setServerErrors([])
      })
      setFormErrors([])
      inputs.forEach((input) => input.reset())
      toast.success(user ? "L'utilisateur a bien été mis à jour" : "L'utilisateur a bien été créé")
      onOpenChange()
    }
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
            <ModalHeader className="flex flex-col gap-1">
              {`${user ? 'Modifier' : 'Ajouter'}`} un utilisateur
            </ModalHeader>
            <ModalBody>
              <form action={submitHandler} ref={formRef}>
                <Input
                  name="identifier"
                  label="Identifiant"
                  placeholder="john.doe@gmail.com"
                  isRequired={true}
                  value={identifier.value}
                  onInput={identifier.inputHandler}
                  isInvalid={identifier.hasError}
                  errorMessage={identifier.errors}
                  onBlur={identifier.blurHandler}
                />
                <Input
                  name="password"
                  label="Mot de passe"
                  placeholder="topsecret"
                  value={password.value}
                  onInput={password.inputHandler}
                  isInvalid={password.hasError}
                  errorMessage={password.errors}
                  onBlur={password.blurHandler}
                />

                <Select
                  name="roles"
                  label="Role"
                  isRequired={true}
                  placeholder="Sélectionnez un rôle"
                  className="mb-2"
                  selectedKeys={[selectedRole]}
                  onChange={roleChangeHandler}
                >
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </Select>

                {!!formErrors.length && (
                  <Alert title="Une erreur s'est produite" content={formErrors} variant="danger" className="my-2" />
                )}
              </form>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fermer
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  formRef.current && formRef.current.requestSubmit()
                }}
                disabled={isConfirmButtonDisabled}
              >
                Valider
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
