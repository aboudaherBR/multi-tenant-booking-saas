import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginService } from '../services/authService';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        setUser({
          name: payload.name,
          userId: payload.userId,
          companyId: payload.companyId
        });

        setIsAuthenticated(true);
      } catch (e) {
        console.log("token inválido");
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    }

    setLoading(false);
  }, []);

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

    setLoading(true);

    try {
      const response = await loginService({ slug, username, password });

      if (response?.token) {
        localStorage.setItem('token', response.token);

        const payload = JSON.parse(atob(response.token.split('.')[1]));

        setUser({
          name: payload.name,
          userId: payload.userId,
          companyId: payload.companyId
        });

        setIsAuthenticated(true);

        return true; // 🔥 CORREÇÃO PRINCIPAL
      } else {
        throw new Error("token não veio");
      }

    } catch (error) {
      console.log("erro no login:", error);
      setUser(null);
      setIsAuthenticated(false);

      return false; // 🔥 CORREÇÃO PRINCIPAL
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };