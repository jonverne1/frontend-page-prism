import {
  Button,
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Textarea,
} from '@headlessui/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Form, useParams } from 'react-router-dom'
import { getProject } from '../services/project'

export default function CreateUpdateProjectForm() {
  const { id } = useParams()

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return
      const projectData = await getProject(id)
      setName(projectData?.name ?? '')
      setDescription(projectData?.description ?? '')
    }
    fetchProject()
  }, [id])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [nameInvalid, setNameInvalid] = useState(false)
  const [descriptionInvalid, setDescriptionInvalid] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(true)

  useEffect(() => {
    const isNameEmpty = name.length <= 0
    setDisableSubmit(isNameEmpty)
    setNameInvalid(isNameEmpty)
  }, [name])

  return (
    <Form
      method={id ? 'put' : 'post'}
      className="w-full max-w-lg px-4 space-y-6"
    >
      {id && <input type="hidden" name="id" value={id} />}
      <Fieldset className="space-y-6 rounded-xl p-6 sm:p-10">
        <Field>
          <Label className="text-sm/6 font-medium">Project Title</Label>
          <Input
            name="name"
            aria-invalid={nameInvalid}
            data-invalid={nameInvalid}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={clsx(
              'mt-3 block w-full rounded-lg border-none py-1.5 px-3 text-sm/6',
              nameInvalid && 'ring-2 ring-red-500',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
          />
        </Field>

        <Field>
          <Label className="text-sm/6 font-medium">Description</Label>
          <Description className="text-sm/6 text-black/50">
            Provide a brief description about your project
          </Description>
          <Textarea
            name="description"
            aria-invalid={descriptionInvalid}
            data-invalid={descriptionInvalid}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={clsx(
              'mt-3 block w-full resize-none rounded-lg border-none py-1.5 px-3 text-sm/6',
              descriptionInvalid && 'ring-2 ring-red-500',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
          />
        </Field>
      </Fieldset>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={disableSubmit}
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
        >
          Save changes
        </Button>
      </div>
    </Form>
  )
}
