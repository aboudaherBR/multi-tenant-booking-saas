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
  const response = await fetch('http://localhost:3000/auth/me', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  return response.json();
}

export { login };