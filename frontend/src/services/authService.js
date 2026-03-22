import apiClient from '../api/apiClient';

async function login(credentials, passwordParam) {
  let slug;
  let username;
  let password;

  if (typeof credentials === 'object') {
    slug = credentials.slug;
    username = credentials.username;
    password = credentials.password;
  } else {
    username = credentials;
    password = passwordParam;
  }

  return apiClient('/login', {
    method: 'POST',
    body: {
      slug,
      username,
      password
    }
  });
}

export async function getCurrentUser() {
  
  try {
    const data = await apiClient('/auth/me');
    return data;
  } catch (error) {
    console.log("🔥 getCurrentUser erro:", error); // 👈 ADICIONA
    return null;
  }
}

export { login };