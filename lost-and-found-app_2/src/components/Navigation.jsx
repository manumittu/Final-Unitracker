import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>Lost & Found System</h1>
      <div className={styles.linkContainer}>
        <Link to="/report-lost" className={`${styles.link} ${styles.lostLink}`}>
          Report Lost Item
        </Link>
        <Link to="/report-found" className={`${styles.link} ${styles.foundLink}`}>
          Report Found Item
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;