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
        <button onClick={onBack}>← Voltar</button>

        <h3>Serviços de {professional.name}</h3>

        {loading ? (
          <p>Carregando serviços...</p>
        ) : services.length === 0 ? (
          <p>Nenhum serviço disponível</p>
        ) : (
          <ul>
            {services.map((s, index) => (
              <li
                key={s.slug || index} // ✅ usa slug
                onClick={() => handleSelect(s)}
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ccc"
                }}
              >
                <strong>{s.name}</strong>

                <div style={{ fontSize: "12px", color: "#666" }}>
                  {s.duration_minutes} min
                </div>

                <div style={{ fontWeight: "bold", marginTop: "4px" }}>
                  R$ {Number(s.price).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  })}
                </div>
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