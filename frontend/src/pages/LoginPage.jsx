
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

function LoginPage() {
  const { login, isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 🚀 REDIRECIONAMENTO BASEADO NO AUTH CONTEXT
  useEffect(() => {
    console.log("USER COMPLETO:", user);
    console.log("isProfessional:", user?.isProfessional);

    if (loading) return;
    if (!isAuthenticated) return;
    if (
      loading ||
      !isAuthenticated ||
      !user ||
      typeof user.isProfessional !== 'boolean'
    ) return;

    if (user.isProfessional) {
      navigate('/professional', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login({ slug, username, password });
      // ❌ NÃO REDIRECIONA AQUI
    } catch (error) {
      console.error('Erro no login:', error);
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginPage;

