function StepAccount({ formData, updateField }) {
  return (
    <div style={styles.container}>

      <input
        type="text"
        placeholder="Seu nome"
        value={formData.name}
        onChange={(e) => updateField("name", e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Usuário"
        value={formData.username}
        onChange={(e) => updateField("username", e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Senha"
        value={formData.password}
        onChange={(e) => updateField("password", e.target.value)}
        style={styles.input}
      />

    </div>
  );
}

export default StepAccount;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  input: {
    height: "48px",
    borderRadius: "10px",
    border: "1px solid #334155",
    backgroundColor: "#1E293B",
    color: "#fff",
    padding: "0 12px",
    fontSize: "14px"
  }
};