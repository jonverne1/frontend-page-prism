import { redirect } from 'react-router-dom'
import { createProject, updateProject } from '../services/project'

export async function updateOrCreateProject({ request }) {
  const formData = await request.formData()
  const id = formData.get('id')
  const name = formData.get('name')
  const description = formData.get('description')

  if (id) {
    // update
    await updateProject(id, { name, description })
    return redirect(`/projects/${id}`)
  } else {
    // create
    const project = await createProject({ name, description })
    return redirect(`/projects/${project.id}`)
  }
}