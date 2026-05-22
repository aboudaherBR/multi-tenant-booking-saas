import styles from './AppLayout.module.css';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo_png.png";


function AppLayout({ children }) {
  console.log("APP LAYOUT RENDERIZOU");
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
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
          onClick={() => navigate('/settings')}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.06V21a2 2 0 1 1-4 0v-.14a1.7 1.7 0 0 0-.4-1.06 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.06-.4H3a2 2 0 1 1 0-4h.14a1.7 1.7 0 0 0 1.06-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.24 3.5l.06.06A1.7 1.7 0 0 0 9 4.6c.38 0 .74-.14 1-.4.26-.26.4-.62.4-1V3a2 2 0 1 1 4 0v.14c0 .38.14.74.4 1 .26.26.62.4 1 .4.38 0 .74-.14 1-.4l.06-.06A2 2 0 1 1 20.5 7.24l-.06.06c-.26.26-.4.62-.4 1 0 .38.14.74.4 1 .26.26.62.4 1 .4H21a2 2 0 1 1 0 4h-.14c-.38 0-.74.14-1 .4-.26.26-.4.62-.4 1z" />
          </svg>
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
          className={styles.navButtonPrimary}
          onClick={() => navigate('/admin/book')}
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