import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../services/api";

export default function BookPublic() {
  const { slug } = useParams();

  const [company, setCompany] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // 🔹 Buscar empresa
        const companyData = await apiClient(`/agendar/${slug}`);
        setCompany(companyData);

        // 🔹 Buscar profissionais
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

  if (loading) return <p>Carregando...</p>;

  if (error) return <p>Erro: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Agendamento</h1>

      <h2>{company.name}</h2>

      <h3>Profissionais</h3>

      {professionals.length === 0 ? (
        <p>Nenhum profissional disponível</p>
      ) : (
        <ul>
          {professionals.map((p) => (
            <li key={p.id}>
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}