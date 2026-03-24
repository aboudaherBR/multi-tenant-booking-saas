import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function ServicesModal({
  slug,
  professional,
  onBack,
  onClose,
  onSelect
}) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await apiClient(
          `/agendar/${slug}/profissionais/${professional.slug}/servicos`
        );
        setServices(data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchServices();
  }, [slug, professional]);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onBack}>← Voltar</button>

        <h3>Serviços de {professional.name}</h3>

        {services.length === 0 ? (
          <p>Nenhum serviço disponível</p>
        ) : (
          <ul>
            {services.map((s) => (
              <li
                key={s.id}
                onClick={() => onSelect(s)}
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ccc"
                }}
              >
                {s.name}
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