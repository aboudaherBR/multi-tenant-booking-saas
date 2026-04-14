function formatDateBR(dateString, time) {
  const date = new Date(dateString);

  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString("pt-BR", { month: "long" });

  return `${weekday}, ${day} de ${month} às ${time}`;
}


export default function ConfirmBookingModal({
  professional,
  service,
  slot,
  onConfirm,
  onBack,
  onClose
}) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <button
            onClick={onBack}
            style={secondaryButton}
          >
            ← Voltar
          </button>

          <button
            onClick={onClose}
            style={closeButton}
          >
            ✕
          </button>
        </div>

        {/* TÍTULO */}
        <h3 style={{ marginTop: 0 }}>
          Confirmar agendamento
        </h3>

        {/* CARD RESUMO */}
        <div style={summaryCard}>
          <p><strong>{professional.name}</strong></p>
          <p>{service.name}</p>
          <p>
            {formatDateBR(slot.date, slot.startTime)}
          </p>

          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            R$ {Number(service.price).toLocaleString("pt-BR", {
              minimumFractionDigits: 2
            })}
          </p>
        </div>

        {/* BOTÃO PRINCIPAL */}
        <button
          onClick={onConfirm}
          style={primaryButton}
        >
          Confirmar agendamento
        </button>

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
  justifyContent: "center"
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px",
  position: "relative"
};

const summaryCard = {
  background: "#f9fafb",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px"
};

const primaryButton = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "#0F172A",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 6px 15px rgba(0,0,0,0.2)"
};

const secondaryButton = {
  background: "transparent",
  border: "1px solid #0F172A",
  color: "#0F172A",
  padding: "6px 12px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "13px"
};

const closeButton = {
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#666"
};