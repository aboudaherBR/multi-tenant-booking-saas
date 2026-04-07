export default function ProfessionalsModal({
  professionals,
  onClose,
  onSelect
}) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={backButtonStyle}>
          ← Voltar
        </button>

        <h3 style={{ marginBottom: "15px" }}>
          Escolha um profissional
        </h3>

        {professionals.length === 0 ? (
          <p>Nenhum profissional disponível</p>
        ) : (
          <div style={listContainerStyle}>
            {professionals.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelect(p)}
                style={cardStyle}
              >
                {/* FOTO */}
                <div style={avatarStyle} />

                {/* CONTEÚDO */}
                <div style={{ flex: 1 }}>
                  <div style={nameStyle}>{p.name}</div>

                  {/* SERVIÇOS (placeholder por enquanto) */}
                  <div style={servicesStyle}>
                    Corte • Barba • Outros
                  </div>

                  {/* BOTÃO VISUAL */}
                  <button
                    style={buttonStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(p);
                    }}
                  >
                    Escolher serviço
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* STYLES */

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

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px",

  maxHeight: "80vh",     // 🔥 IMPORTANTE
  display: "flex",       // 🔥 IMPORTANTE
  flexDirection: "column"
};

const backButtonStyle = {
  marginBottom: "10px",
  background: "none",
  border: "none",
  cursor: "pointer"
};

const cardStyle = {
  cursor: "pointer",
  marginBottom: "12px",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  display: "flex",
  gap: "12px",
  background: "#fff",
  transition: "0.2s"
};

const avatarStyle = {
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  background: "#e5e7eb"
};

const nameStyle = {
  fontWeight: "bold",
  marginBottom: "4px"
};

const servicesStyle = {
  fontSize: "13px",
  color: "#666",
  marginBottom: "10px"
};

const buttonStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer",
  fontSize: "13px"
};

const listContainerStyle = {
  overflowY: "auto",
  marginTop: "10px"
};