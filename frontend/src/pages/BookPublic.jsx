import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function BookPublic() {
  const { slug } = useParams();

  const [company, setCompany] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [phone, setPhone] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientChecked, setClientChecked] = useState(false);

  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [services, setServices] = useState([]);

  // 🔹 buscar empresa + profissionais
  useEffect(() => {
    async function fetchData() {
      try {
        const companyData = await apiClient(`/agendar/${slug}`);
        setCompany(companyData);

        const professionalsData = await apiClient(`/agendar/${slug}/profissionais`);
        setProfessionals(professionalsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // 🔹 verificar cliente pelo telefone
  async function checkClient() {
    if (!phone) return;

    try {
      const data = await apiClient(`/agendar/${slug}/cliente?phone=${phone}`);

      if (data) {
        setClientName(data.name);
      }

    } catch (err) {
      // cliente não existe → fluxo normal
    }

    setClientChecked(true);
  }

  // 🔹 selecionar profissional
  async function handleSelectProfessional(professional) {
    setSelectedProfessional(professional);

    try {
      const data = await apiClient(
        `/agendar/${slug}/profissionais/${professional.slug}/servicos`
      );

      setServices(data);
    } catch (err) {
      console.log("erro ao carregar serviços", err);
    }
  }

  // 🔹 tela inicial (identificação)
  if (!clientChecked) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Identifique-se</h2>

        <input
          type="text"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Nome"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <br /><br />

        <button onClick={checkClient}>
          Continuar
        </button>
      </div>
    );
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Agendamento</h1>

      <h2>{company.name}</h2>

      {/* 🔥 SAUDAÇÃO */}
      {clientName && (
        <p>
          Olá, <strong>{clientName}</strong>, bem-vindo(a) de volta 👋
        </p>
      )}

      <h3>Profissionais</h3>

      {professionals.length === 0 ? (
        <p>Nenhum profissional disponível</p>
      ) : (
        <ul>
          {professionals.map((p) => (
            <li
              key={p.id}
              onClick={() => handleSelectProfessional(p)}
              style={{ cursor: "pointer", marginBottom: "10px" }}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}

      {selectedProfessional && (
        <>
          <h3>Serviços de {selectedProfessional.name}</h3>

          {services.length === 0 ? (
            <p>Nenhum serviço disponível</p>
          ) : (
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}