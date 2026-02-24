const BASE_URL = 'http://localhost:3000';

async function apiClient(endpoint, options = {}) {
  const config = {
    method: options.method || 'GET',
    credentials: 'include', // ESSENCIAL para cookie-based session
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // sessão inválida ou expirada
    window.location.href = '/login';
    return;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Erro inesperado');
  }

  return data;
}

export default apiClient;