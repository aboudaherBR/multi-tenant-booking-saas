import styles from './AppLayout.module.css';

function ProfessionalLayout({ children }) {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h3 className={styles.title}>Agendô</h3>
      </header>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

export default ProfessionalLayout;