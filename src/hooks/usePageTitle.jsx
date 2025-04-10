import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getProject } from '../services/project'

const usePageTitle = () => {
  const [pageTitle, setPageTitle] = useState('Page Prism')
  const { pathname } = useLocation()

  useEffect(() => {
    const fetchTitle = async () => {
      if (pathname === '/') {
        setPageTitle('Dashboard')
        return
      }

      if (pathname === '/projects') {
        setPageTitle('Projects')
        return
      }

      const matchProjectDetail = pathname.match(/^\/projects\/([^/]+)$/)
      const matchProjectEdit = pathname.match(/^\/projects\/edit\/([^/]+)$/)

      const projectId = matchProjectDetail?.[1] || matchProjectEdit?.[1]
      if (projectId) {
        try {
          const project = await getProject(projectId)
          setPageTitle(project.name)
        } catch {
          setPageTitle('Project Not Found')
        }
        return
      }

      setPageTitle('Page Prism')
    }

    fetchTitle()
  }, [pathname])

  return pageTitle
}

export default usePageTitle
