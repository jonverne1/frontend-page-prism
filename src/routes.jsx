import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import CreateUpdateProjectForm from './forms/CreateUpdateProjectForm'
import { updateOrCreateProject } from './actions/updateOrCreateProject'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'projects/create',
        element: <CreateUpdateProjectForm />,
        action: updateOrCreateProject,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetail />,
      },
      {
        path: 'projects/edit/:id',
        element: <CreateUpdateProjectForm />,
        action: updateOrCreateProject,
      },
    ],
  },
])

export default router
