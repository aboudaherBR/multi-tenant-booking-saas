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
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);

        const data = await apiClient(
          `/agendar/${slug}/profissionais/${professional.slug}/servicos`
        );

        setServices(data || []);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [slug, professional]);

  function handleSelect(service) {
    if (!service || !service.slug) return;
    onSelect(service);
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* HEADER */}
        <div style={headerStyle}>
          <button onClick={onBack} style={backButtonStyle}>
            ← Voltar
          </button>

          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>
        </div>

        <h3>Serviços de {professional.name}</h3>

        {loading ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            Carregando...
          </div>
        ) : (
          <div style={listContainerStyle}>
            <ul style={listStyle}>
              {services.map((s, index) => (
                <li
                  key={s.slug || index}
                  className={`selectable ${
                    selectedServiceId === s.slug ? "is-selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedServiceId(s.slug);
                    setTimeout(() => handleSelect(s), 250);
                  }}
                  style={cardStyle}
                >
                  <strong style={{ fontSize: "18px" }}>
                    {s.name}
                  </strong>

                  <div style={metaStyle}>
                    {s.duration_minutes} min
                  </div>

                  <div style={priceStyle}>
                    R${" "}
                    {Number(s.price).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* STYLES */

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