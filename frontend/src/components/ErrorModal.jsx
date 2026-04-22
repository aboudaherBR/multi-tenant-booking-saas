export default function ErrorModal({ message, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999999
    }}>
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
        maxWidth: "320px",
        width: "90%"
      }}>
        <p>{message}</p>

        <button
          onClick={onClose}
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            background: "#0f172a",
            color: "#fff"
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}