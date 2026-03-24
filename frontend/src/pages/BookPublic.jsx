import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../services/api"; // ajusta se o caminho for diferente

export default function BookPublic() {
  const { slug } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const data = await apiClient(`/agendar/${slug}`);
        setCompany(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [slug]);

  if (loading) return <p>Carregando...</p>;

  if (error) return <p>Erro: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Agendamento</h1>
      <h2>{company.name}</h2>
      <p>Slug: {company.slug}</p>
    </div>
  );
}