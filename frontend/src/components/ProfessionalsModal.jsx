import ProfessionalsCards from "./ProfessionalsCards";
import { useState } from "react";

export default function ProfessionalsModal({
  professionals,
  onClose,
  onSelect
}) {
  const [selectedProfessionalId, setSelectedProfessionalId] =
    useState(null);

  return (
    <div className="modal-backdrop">
      <div
        className="modal-content modal-content--scrollable"
        style={{
          maxWidth: "520px",
          width: "95%",
          textAlign: "left"
        }}
      >
        <div className="modal-header">
          <button
            onClick={onClose}
            className="button-pill"
          >
            Voltar
          </button>

          <button
            onClick={onClose}
            className="button-icon"
          >
            ✕
          </button>
        </div>

        <h3
          className="heading"
          style={{ marginBottom: "15px" }}
        >
          Escolha um profissional
        </h3>

        {professionals.length === 0 ? (

          <p className="text-muted">
            Nenhum profissional disponível
          </p>

        ) : (

          <div
            style={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            {professionals.map((p) => (
              <ProfessionalsCards
                key={p.id}
                professional={p}
                isSelected={
                  selectedProfessionalId === p.id
                }
                onSelect={(professional) => {

                  setSelectedProfessionalId(
                    professional.id
                  );

                  setTimeout(() => {
                    onSelect(professional);
                  }, 800);
                }}
              />
            ))}
          </div>

        )}
      </div>
    </div>
  );
}