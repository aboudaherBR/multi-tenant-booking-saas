function StepAddress({ formData, updateField }) {
  return (
    <div style={styles.container}>

      <input
        type="text"
        placeholder="Rua"
        value={formData.address_street}
        onChange={(e) => updateField("address_street", e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Número"
        value={formData.address_number}
        onChange={(e) => updateField("address_number", e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Bairro"
        value={formData.address_neighborhood}
        onChange={(e) => updateField("address_neighborhood", e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Cidade"
        value={formData.address_city}
        onChange={(e) => updateField("address_city", e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Estado"
        value={formData.address_state}
        onChange={(e) => updateField("address_state", e.target.value)}
        style={styles.input}
      />

    </div>
  );
}

export default StepAddress;

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