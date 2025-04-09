import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getProject } from '../services/project'

const usePageTitle = () => {
  const [pageTitle, setPageTitle] = useState('Page Prism')
  const location = useLocation()

  useEffect(() => {
    const fetchTitle = async () => {
      const { pathname } = location
      const PROJECT_DETAILS_REGEX = /^\/projects\/([^/]+)$/
      const PROJECT_EDIT_REGEX = /^\/projects\/edit\/([^/]+)$/
      if (pathname === '/') {
        setPageTitle('Dashboard')
      } else if (pathname === '/projects') {
        setPageTitle('Projects')
      } else if (PROJECT_DETAILS_REGEX.test(pathname)) {
        const match = pathname.match(PROJECT_DETAILS_REGEX)
        const projectId = match?.[1]

        try {
          const project = await getProject(projectId)
          setPageTitle(project.name)
        } catch (err) {
          setPageTitle('Project Not Found')
        }
      } else if (PROJECT_EDIT_REGEX.test(pathname)) {
        const match = pathname.match(PROJECT_EDIT_REGEX)
        const projectId = match?.[1]

        try {
          const project = await getProject(projectId)
          setPageTitle(project.name)
        } catch (err) {
          setPageTitle('Project Not Found')
        }
      } else {
        setPageTitle('Page Prism')
      }
    }

    fetchTitle()
  }, [location.pathname])

  return pageTitle
}

export default usePageTitle
