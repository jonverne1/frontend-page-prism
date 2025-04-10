import { Fragment, useEffect, useRef, useState } from 'react'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { getOS } from '../utils/getOs'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import useDebounce from '../hooks/useDebounce'
import { Project } from '../models/schema'
import { useNavigate } from 'react-router-dom'

export const ProjectSearchBox = () => (
  <div className="inline-flex gap-1 border rounded px-3 py-2">
    <MagnifyingGlassIcon className="size-4" />
    <span>{`${getOS() === 'mac' ? 'Cmd' : 'Ctrl'} + K`}</span>
  </div>
)

export default function ProjectSearch({
  projects = [],
}: {
  projects: Project[]
}) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const inputRef = useRef<HTMLInputElement>(null)

  // Hotkey: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = getOS() === 'mac'
      if (
        (isMac && e.metaKey && e.key === 'k') ||
        (!isMac && e.ctrlKey && e.key === 'k')
      ) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isOpen])

  // Debounce the filtering
  useDebounce(
    () => {
      if (query === '') {
        setFilteredProjects(projects)
      } else {
        const queryNormalized = query.toLowerCase()
        setFilteredProjects(
          projects.filter((p) =>
            `${p.name} ${p.description}`.toLowerCase().includes(queryNormalized)
          )
        )
      }
    },
    [query],
    300
  )

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-start justify-center p-4 mt-[15vh]">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl ring-1 ring-black/10">
              <DialogTitle className="text-sm text-gray-600 mb-1">
                Search Projects
              </DialogTitle>

              <Combobox
                onChange={(project: Project) =>
                  navigate(`/projects/${project.id}`)
                }
              >
                <div className="relative">
                  <ComboboxInput
                    ref={inputRef}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search by name or description..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10 focus:outline-none">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <ComboboxOption
                          key={project.id}
                          value={project}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 ${
                              active
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-900'
                            }`
                          }
                        >
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {project.description}
                          </div>
                        </ComboboxOption>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No results found.
                      </div>
                    )}
                  </ComboboxOptions>
                </div>
              </Combobox>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
