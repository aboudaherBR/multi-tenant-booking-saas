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

        // 🔥 VALIDAÇÃO CRÍTICA (evita bug silencioso)
        if (!Array.isArray(data)) {
          console.error("Resposta inválida de serviços:", data);
          setServices([]);
          return;
        }

        // 🔥 GARANTE que todo serviço tem ID
        const validServices = data.filter((s) => s && s.id);

        setServices(validServices);
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
    // 🔥 DEBUG IMPORTANTE
    console.log("Serviço selecionado:", service);

    if (!service || !service.id) {
      console.error("Serviço inválido selecionado:", service);
      return;
    }

    onSelect(service); // ✅ PASSA OBJETO COMPLETO
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onBack}>← Voltar</button>

        <h3>Serviços de {professional.name}</h3>

        {loading ? (
          <p>Carregando...</p>
        ) : services.length === 0 ? (
          <p>Nenhum serviço disponível</p>
        ) : (
          <ul>
            {services.map((s) => (
              <li
                key={s.id}
                onClick={() => handleSelect(s)}
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ccc"
                }}
              >
                <strong>{s.name}</strong>
                {s.duration_minutes && (
                  <span style={{ marginLeft: "10px", fontSize: "12px" }}>
                    ({s.duration_minutes} min)
                  </span>
                )}
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