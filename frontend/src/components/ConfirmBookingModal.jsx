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
        <h3>Confirmar Agendamento</h3>

        <p><strong>Profissional:</strong> {professional.name}</p>
        <p><strong>Serviço:</strong> {service.name}</p>
        <p><strong>Data:</strong> {slot.date}</p>
        <p><strong>Horário:</strong> {slot.startTime}</p>

        <div style={{ marginTop: "20px" }}>
          <button onClick={onBack}>← Voltar</button>

          <button
            onClick={onConfirm}
            style={{ marginLeft: "10px" }}
          >
            Confirmar
          </button>
        </div>

        <button onClick={onClose} style={{ marginTop: "10px" }}>
          Fechar
        </button>
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