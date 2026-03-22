import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginService, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateSession() {
      try {
        const userData = await getCurrentUser();

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    validateSession();
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

    await loginService({ slug, username, password });

    setIsAuthenticated(true);

    // 🔥 RETRY CONTROLADO (ESSA É A CORREÇÃO REAL)
    let userData = null;

    for (let i = 0; i < 3; i++) {
      try {
        userData = await getCurrentUser();

        if (userData) break;

        await new Promise(res => setTimeout(res, 300));
      } catch (e) {
        await new Promise(res => setTimeout(res, 300));
      }
    }

    if (userData) {
      setUser(userData);
    } else {
      console.log("não conseguiu obter usuário após login");
    }

    setLoading(false);
  }

  function logout() {
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