export default function NameErrorModal({ onClose }) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    width: "90%",
                    maxWidth: "300px",
                    textAlign: "center"
                }}
            >
                <h3>Nome obrigatório</h3>

                <p>Digite seu nome para continuar.</p>

                <button
                    onClick={onClose}
                    style={{
                        marginTop: "15px",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        background: "#0f172a",
                        color: "#fff",
                        cursor: "pointer",

                    }}
                >
                    Ok
                </button>
            </div>
        </div>
    );
}