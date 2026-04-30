const BASE_URL = "https://barbershop-backend-szdy.onrender.com/api";
// ✅ NOVO: classe de erro estruturada (antes não existia ou não era usada corretamente)
export class ApiError extends Error {
  constructor({ message, status, body, response }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.response = response;
  }
}

async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    }
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (err) {
    // ⚠️ AQUI NÃO MUDEI (pode melhorar depois, mas mantive simples)
    throw new Error("Servidor iniciando, tente novamente em alguns segundos...");
  }

  if (response.status === 401) {
    console.log("🚨 401 detectado");
    localStorage.removeItem('token');

    // 🔥 ALTERADO: agora usa ApiError (antes era Error simples)
    throw new ApiError({
      message: 'Unauthorized',
      status: 401,
      body: null,
      response
    });
  }

  // ✅ MELHORADO: leitura segura do body
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;

  try {
    data = isJson ? await response.json() : await response.text();
  } catch {
    data = null;
  }

  if (!response.ok) {

    // 🔥 ALTERADO: construção segura da mensagem
    const message =
      data && typeof data === "object" && "message" in data
        ? data.message
        : `HTTP ${response.status}`;

    // 🔥 PRINCIPAL MUDANÇA: não usa mais Error simples
    throw new ApiError({
      message,
      status: response.status,
      body: data,
      response
    });
  }

  return data;
}

export default apiClient;