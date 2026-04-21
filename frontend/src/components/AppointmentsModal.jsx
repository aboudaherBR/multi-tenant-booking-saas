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
                            {appointments.map((a) => {
                                console.log("APPOINTMENT:", a);

                                return (
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
                                            R$ {Number(a.price || 0).toLocaleString("pt-BR", {
                                                minimumFractionDigits: 2
                                            })}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
};

const modalStyle = {
    background: "#fff",
    position: "relative",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column"
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
};

const backButtonStyle = {
    background: "#0F172A",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    cursor: "pointer"
};

const closeButtonStyle = {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#666"
};

const listContainerStyle = {
    overflowY: "auto",
    flex: 1,
    minHeight: 0,
    marginTop: "10px"
};

const listStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0
};

const cardStyle = {
    cursor: "pointer",
    marginBottom: "16px",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 12px 27px rgba(0,0,0,0.4)"
};

const metaStyle = {
    marginTop: "6px",
    fontSize: "13px",
    opacity: 0.8
};

const priceStyle = {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "bold"
};