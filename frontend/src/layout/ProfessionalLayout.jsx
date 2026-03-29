import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.css';

function ProfessionalLayout() {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h3 className={styles.title}>Agendô</h3>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default ProfessionalLayout;