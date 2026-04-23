import styles from './AppLayout.module.css';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo_png.png";

function AppLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className={styles.appContainer}>

      {/* HEADER */}
      <header className={styles.header}>

        <img
          src={logo}
          alt="Logo"
          style={{
            width: "100px"
          }}
        />

        <button
          className={styles.settingsButton}
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} strokeWidth={2} />
        </button>

      </header>

      {/* CONTEÚDO */}
      <main className={styles.main}>
        {children}
      </main>

      {/* MENU INFERIOR */}
      <nav className={styles.bottomNav}>

        <button
          className={styles.navButton}
          onClick={() => navigate('/appointments')}
        >
          Agenda
        </button>

        <button
          className={styles.navButtonPrimary} // 👈 destaque
          onClick={() => navigate('/schedule')}
        >
          Agendar
        </button>

        <button className={styles.navButton}>
          Clientes
        </button>

      </nav>

    </div>
  );
}

export default AppLayout;