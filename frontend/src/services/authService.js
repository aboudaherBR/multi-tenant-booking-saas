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
    const response = await fetch("/api/auth/me", {
      credentials: "include"
    });

    if (response.status === 401) {
      return null;
    }
    return await response.json();

  } catch (error) {
    return null;
  }
}

export { login };