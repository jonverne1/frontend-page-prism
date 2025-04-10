import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteProject, getProject } from '../services/project'
import Button from '../components/Button'
import styles from './ProjectDetail.module.css'
import {
  createInspiration,
  deleteInspiration,
  getInspirationsByProject,
} from '../services/inspiration'
import AddInspirationForm from '../forms/AddInspiratoinForm'

const ProjectDetail = () => {
  const [project, setProject] = useState(null)
  const { id: projectId } = useParams()
  let navigate = useNavigate()

  useEffect(() => {
    const fetchProject = async () => {
      const projectData = await getProject(projectId)
      const inspirations = await getInspirationsByProject(projectId)
      console.log(inspirations)
      setProject({ ...projectData, inspirations })
    }
    fetchProject()
  }, [projectId])

  const handleDelete = async () => {
    try {
      await deleteProject(projectId)
      navigate('/projects')
    } catch (err) {
      //error deleting
      //show to user
      //dont navigate
    }
  }

  if (!project) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{project.name}</h1>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.section}>
        <h2 className={styles.subheading}>Project Details</h2>
        <p>
          <strong>Created:</strong>{' '}
          {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Last Updated:</strong>{' '}
          {new Date(project.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.subheading}>Inspirations</h2>
        {project.inspirations?.length > 0 ? (
          <ul className={styles.inspirationList}>
            {project.inspirations.map((inspiration) => (
              <li key={inspiration.id}>
                {inspiration.websiteMetadata.title ||
                  inspiration.websiteMetadata.url}
              </li>
            ))}
          </ul>
        ) : (
          //todo: move the create logic and nav action to the routes file
          <AddInspirationForm
            projectId={projectId}
            onInspirationAdded={(newInspo) =>
              navigate(`/projects/inspiration/${newInspo.id}`)
            }
          />
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Link to={`/projects/edit/${project.id}`}>
          <Button className={styles.editButton}>Edit Project</Button>
        </Link>
        <Button className={styles.deleteButton} onClick={handleDelete}>
          Delete Project
        </Button>
      </div>
    </div>
  )
}

export default ProjectDetail
