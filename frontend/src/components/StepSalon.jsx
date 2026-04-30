function StepSalon({ formData, updateField }) {
  return (
    <div style={styles.container}>

      <input
        type="text"
        placeholder="Nome do salão"
        value={formData.salonName}
        onChange={(e) => updateField("salonName", e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Telefone"
        value={formData.companyPhone}
        onChange={(e) => updateField("companyPhone", e.target.value)}
        style={styles.input}
      />

    </div>
  );
}

export default StepSalon;

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