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

        console.log("SERVICES RESPONSE:", data); // 🔥 DEBUG

        // ✅ NÃO FILTRA MAIS (isso quebrava antes)
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
    console.log("SERVICE CLICK:", service); // 🔥 DEBUG

    // 🔥 VALIDAÇÃO CORRETA (AGORA COM SLUG)
    if (!service || !service.slug) {
      console.error("Serviço inválido:", service);
      return;
    }

    onSelect(service); // ✅ passa objeto completo
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>

          <button
            onClick={onBack}
            style={{
              background: "#0F172A",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            ← Voltar
          </button>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#666"
            }}
          >
            ✕
          </button>

        </div>

        <h3>Serviços de {professional.name}</h3>

        {loading ? (
          <p>Carregando serviços...</p>
        ) : services.length === 0 ? (
          <p>Nenhum serviço disponível</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {services.map((s, index) => (
              <li
                key={s.slug || index}
                onClick={() => {
                  console.log("🔥 SERVICE CLICK");

                  setSelectedServiceId(s.slug);

                  setTimeout(() => {
                    handleSelect(s);
                  }, 250);
                }}
                style={{
                  cursor: "pointer",
                  marginBottom: "16px",
                  padding: "20px",
                  borderRadius: "16px",
                  background: "#0f172a",
                  color: "#fff",
                  textAlign: "center",
                  boxShadow: "0 12px 27px rgba(0,0,0,0.4)",
                  transform: "translateY(0)"                  
                }}
              >
                <strong style={{ fontSize: "18px" }}>
                  {s.name}
                </strong>

                <div style={{ marginTop: "6px", fontSize: "13px", opacity: 0.8 }}>
                  {s.duration_minutes} min
                </div>

                <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "bold" }}>
                  R$ {Number(s.price).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
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
  position: "relative",
  padding: "20px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "400px",
  maxHeight: "80vh",
  overflowY: "auto",
};