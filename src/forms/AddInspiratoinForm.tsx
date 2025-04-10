import { useState } from 'react'
import { useNavigation, Form } from 'react-router-dom'
import { Dialog } from '@headlessui/react'
import { createInspiration } from '../services/inspiration'
import {
  getMetadata,
  getScreenshot,
  mockGetMetadata,
  mockGetScreenshot,
} from '../utils/api'
import type { Inspiration } from '../models/schema'

interface AddInspirationFormProps {
  projectId: string
  onInspirationAdded?: (inspiration: Inspiration) => void
}

export default function AddInspirationForm({
  projectId,
  onInspirationAdded,
}: AddInspirationFormProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  const handleCreate = async () => {
    setError(null)
    try {
      const encodedUrl = encodeURIComponent(url)
      const [metadata, screenshotUri] = await Promise.all([
        // getMetadata(encodedUrl),
        // getScreenshot(encodedUrl),
        mockGetMetadata(),
        mockGetScreenshot(),
      ])

      const newInspiration = await createInspiration({
        projectId,
        websiteMetadata: metadata,
        screenshot_uri: screenshotUri,
        notes: '',
      })

      onInspirationAdded?.(newInspiration)
      setUrl('')
      setIsOpen(false)
    } catch (err) {
      console.error(err)
      setError(
        'Could not fetch metadata or screenshot. Check the URL and try again.'
      )
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
      >
        Add Inspiration
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-md w-full rounded-xl p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">
              Add Website Inspiration
            </Dialog.Title>

            <Form
              method="post"
              onSubmit={async (e) => {
                e.preventDefault()
                await handleCreate()
              }}
              className="space-y-4 mt-4"
            >
              <label
                htmlFor="url"
                className="block font-medium text-sm text-gray-700"
              >
                Website URL
              </label>
              <input
                id="url"
                name="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. nytimes.com"
                className="w-full border rounded px-3 py-2"
                required
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add'}
                </button>
              </div>
            </Form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
