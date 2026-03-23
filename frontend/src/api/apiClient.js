const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function apiClient(endpoint, options = {}) {
  console.log("BASE_URL:", BASE_URL);

  const token = localStorage.getItem('token');

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && {
        Authorization: `Bearer ${token}` 
      }),
      ...(options.headers || {})
    }
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    console.log("🚨 401 detectado");
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Erro inesperado');
  }

  return data;
}

export default apiClient;