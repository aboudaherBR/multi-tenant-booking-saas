import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchClients() {
    try {
      const data = await apiClient('/clients');
      setClients(data.clients || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }

  // 🔹 carga inicial
  useEffect(() => {
    fetchClients();
  }, []);

  // 🔥 polling leve (produção)
  useEffect(() => {

    const interval = setInterval(() => {
      fetchClients();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  if (loading) return <div>Carregando clientes...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Clientes</h1>

      {clients.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              {client.name} - {client.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClientsPage;