import styles from './Header.module.css'
import { ProjectSearchBox } from './ProjectSearch'

const Header = ({ title }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        {title.toLowerCase() === 'projects' && <ProjectSearchBox />}
      </div>
    </header>
  )
}

export default Header
