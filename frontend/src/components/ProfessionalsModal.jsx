import ProfessionalsCards from "./ProfessionalsCards";
import { useState } from "react";

export default function ProfessionalsModal({
  professionals,
  onClose,
  onSelect
}) {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(null);
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button
          onClick={onClose}
          style={{
            background: "#0F172A",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "13px",
            cursor: "pointer",
            marginBottom: "12px",
            transition: "all 0.2s ease",
            boxShadow: "0 10px 18px rgba(0,0,0,0.3)",
            transform: "translateY(0)"
          }}
        >
          Voltar
        </button>

        <h3 style={{ marginBottom: "15px" }}>
          Escolha um profissional
        </h3>

        {professionals.length === 0 ? (
          <p>Nenhum profissional disponível</p>
        ) : (
          <div style={listContainerStyle}>
            onSelect={(professional) => {
              console.log("🔥 CLIQUE NO MODAL");

              setSelectedProfessionalId(professional.id);

              setTimeout(() => {
                console.log("🔥 NAVEGANDO");
                onSelect(professional);
              }, 800);
            }}
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
  maxHeight: "80vh",
  display: "flex",
  flexDirection: "column"
};

const backButtonStyle = {
  marginBottom: "10px",
  background: "none",
  border: "none",
  cursor: "pointer"
};

const listContainerStyle = {
  overflowY: "auto",
  marginTop: "10px"
};