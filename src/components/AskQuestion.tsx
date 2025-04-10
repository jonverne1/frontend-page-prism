import { useEffect, useRef, useState } from 'react'
import { askQuestion } from '../services/kuzco'

const getImageUrlFromPrompt = (text: string): string | null => {
  const match = text.match(/!\[.*?\]\((.*?)\)/)
  return match ? match[1] : null
}

export default function AskModal() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [imageSrc, setImageSrc] = useState<string>()
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponse('')
    try {
      const result = await askQuestion(prompt)
      setResponse(result)
      setImageSrc(getImageUrlFromPrompt(result) || undefined)
    } catch (err) {
      setResponse('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }, [])

  return (
    <div className="flex flex-col items-center p-4">
      {imageSrc && <img src={imageSrc} alt="generated image" />}
      <h1 className="text-lg font-medium text-gray-800 mb-4 w-full">
        Ask a question
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <input
          ref={inputRef}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Type your question..."
        />
        <button
          type="submit"
          disabled={loading}
          className="self-end rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>

      {response && (
        <div className="mt-4 rounded bg-gray-100 p-3 text-sm text-gray-800 whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  )
}
