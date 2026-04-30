import { useState } from "react";

function SignupPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  function handleStart() {
    setIsWizardOpen(true);
  }

  function handleClose() {
    setIsWizardOpen(false);
  }

  return (
    <div style={styles.page}>

      {/* HERO / CONTAINER PRINCIPAL */}
      <div style={styles.container}>

        {/* ÁREA VISUAL (logo / título depois) */}
        <div style={styles.hero}>
          {/* futuro conteúdo */}
        </div>

        {/* ÁREA DE AÇÃO */}
        <div style={styles.actions}>
          <button style={styles.button} onClick={handleStart}>
            {/* texto depois */}
          </button>
        </div>

      </div>

      {/* WIZARD (overlay) */}
      {isWizardOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            {/* WizardContainer entra aqui depois */}

            <button onClick={handleClose} style={styles.close}>
              X
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default SignupPage;

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0F172A",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px"
  },

  container: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },

  hero: {
    height: "200px",
    borderRadius: "16px",
    backgroundColor: "#1E293B"
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  button: {
    height: "48px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#22C55E",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#0F172A",
    borderRadius: "16px",
    padding: "16px",
    position: "relative"
  },

  close: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer"
  }
};