import { Outlet, useNavigate } from 'react-router-dom';
import styles from './AppLayout.module.css';
import { Settings } from 'lucide-react';

function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h3 className={styles.title}>Agendô</h3>

        <button
          className={styles.settingsButton}
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} strokeWidth={2} />
        </button>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <nav className={styles.bottomNav}>
        <button onClick={() => navigate('/appointments')}>
          Agenda
        </button>

        <button onClick={() => navigate('/schedule')}>
          Agendar
        </button>

        <button>
          Clientes
        </button>
      </nav>
    </div>
  );
}

export default AppLayout;