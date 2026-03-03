import styles from './AppLayout.module.css';
import { Settings } from 'lucide-react';

function AppLayout({ children }) {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h3 className={styles.title}>Agendô</h3>
          <button className={styles.settingsButton}>
            <Settings size={20} strokeWidth={2} />
          </button>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <nav className={styles.bottomNav}>
        <button className={styles.navButton}>Hoje</button>
        <button className={styles.navButton}>Agendar</button>
        <button className={styles.navButton}>Clientes</button>
      </nav>
    </div>
  );
}

export default AppLayout;