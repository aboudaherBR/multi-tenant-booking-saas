import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await apiClient('/clients');
        setClients(data.clients);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
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