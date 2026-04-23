import styles from './AppLayout.module.css';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo_png.png";


function AppLayout({ children }) {
  const navigate = useNavigate();
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>

        <img 
        style = {{
          width: "120px",
          opacity: 0.9
        }}src={logo} alt="Logo" />
        <button
          className={styles.settingsButton}
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} strokeWidth={2} />
        </button>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <nav className={styles.bottomNav}>
        <button onClick={() => navigate('/appointments')}>
          Ver Agenda
        </button>
        <button
          className={styles.navButton}
          onClick={() => navigate('/schedule')}
        >
          Agendar
        </button>
        <button className={styles.navButton}>Clientes</button>
      </nav>
    </div>
  );
}

export default AppLayout;