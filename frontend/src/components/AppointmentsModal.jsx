import { formatDateBR } from "../utils/date.utils";

export default function AppointmentsModal({ appointments, onClose }) {
    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>

                {/* HEADER */}
                <div style={headerStyle}>
                    <div /> {/* vazio pra alinhar */}
                    <button onClick={onClose} style={closeButtonStyle}>
                        ✕
                    </button>
                </div>

                <h3>Meus agendamentos</h3>

                <div style={listContainerStyle}>
                    {appointments.length === 0 ? (
                        <p>Nenhum agendamento encontrado.</p>
                    ) : (
                        <ul style={listStyle}>
                            {appointments.map((a) => (
                                <li
                                    key={a.id}
                                    style={cardStyle}
                                >
                                    <strong style={{ fontSize: "16px" }}>
                                        {formatDateBR(a.date, a.start_time)}
                                    </strong>

                                    <div style={metaStyle}>
                                        {a.service_name}
                                    </div>

                                    <div style={metaStyle}>
                                        com {a.professional_name}
                                    </div>
                                    <div style={priceStyle}>
                                        R$ {Number(a.price).toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2
                                        })}
                                        console.log(a);
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}

const priceStyle = {
  marginTop: "10px",
  fontSize: "16px",
  fontWeight: "bold"
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};
