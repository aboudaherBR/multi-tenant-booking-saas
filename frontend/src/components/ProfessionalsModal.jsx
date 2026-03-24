export default function ProfessionalsModal({
  professionals,
  onClose,
  onSelect
}) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={{ marginBottom: "10px" }}>
          ← Voltar
        </button>

        <h3>Escolha um profissional</h3>

        {professionals.length === 0 ? (
          <p>Nenhum profissional disponível</p>
        ) : (
          <ul>
            {professionals.map((p) => (
              <li
                key={p.id}
                onClick={() => onSelect(p)}
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ccc"
                }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "400px"
};