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
          <div>
            {professionals.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelect(p)}
                style={cardStyle}
              >
                {/* FOTO */}
                <div style={avatarStyle} />

                {/* INFO */}
                <div>
                  <div style={nameStyle}>
                    {p.name}
                  </div>

                  <div style={subtitleStyle}>
                    Ver serviços
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* OVERLAY */
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};

/* MODAL */
const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px"
};

/* CARD */
const cardStyle = {
  cursor: "pointer",
  marginBottom: "12px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#fff",
  transition: "all 0.2s ease"
};

/* AVATAR */
const avatarStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "#e5e7eb"
};

/* NAME */
const nameStyle = {
  fontWeight: "bold"
};

/* SUBTITLE */
const subtitleStyle = {
  fontSize: "14px",
  color: "#666"
};