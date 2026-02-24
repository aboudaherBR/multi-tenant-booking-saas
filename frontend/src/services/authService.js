import apiClient from '../api/apiClient';

async function login(username, password) {
  return apiClient('/login', {
    method: 'POST',
    body: {
      username,
      password
    }
  });
}

export async function getCurrentUser() {
  const response = await fetch('http://localhost:3000/auth/me', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  return response.json();
}

export { login };