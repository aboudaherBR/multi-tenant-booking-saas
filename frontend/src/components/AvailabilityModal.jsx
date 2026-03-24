import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function AvailabilityModal({
  slug,
  professional,
  service,
  onBack,
  onClose,
  onSelect
}) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const data = await apiClient(
          `/agendar/${slug}/profissionais/${professional.slug}/disponibilidade?serviceId=${service.id}`
        );

        setSlots(data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchAvailability();
  }, [slug, professional, service]);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onBack}>← Voltar</button>

        <h3>
          Horários para {service.name} com {professional.name}
        </h3>

        {slots.length === 0 ? (
          <p>Nenhum horário disponível</p>
        ) : (
          <ul>
            {slots.map((slot, index) => (
              <li
                key={index}
                onClick={() => onSelect(slot)}
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ccc"
                }}
              >
                {slot.date} - {slot.time}
              </li>
            ))}
          </ul>
        )}

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