import { useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import { getInspiration } from '../services/inspiration'
import { useNavigate, useParams } from 'react-router-dom'
import { Inspiration } from '../models/schema'

export default function InspirationDetail() {
  const [inspiration, setInspiration] = useState<Inspiration>()
  const { id: inspirationId } = useParams()
  // let navigate = useNavigate()

  useEffect(() => {
    const fetchInspo = async () => {
      if (!inspirationId) return
      const inspiration = await getInspiration(inspirationId)
      setInspiration(inspiration)
    }
    fetchInspo()
  }, [inspirationId])

  return (
    <div className="flex items-center gap-8">
      <img
        className="flex-grow basis-1/3 max-w-[50%] object-contain"
        src={inspiration?.websiteMetadata.image || undefined}
        alt="Page prismn"
      />
      <div className="flex flex-col gap-4 flex-grow basis-2/3">
        <strong>{inspiration?.websiteMetadata.title}</strong>
        <span>{inspiration?.websiteMetadata.description}</span>
      </div>
    </div>
  )
}
