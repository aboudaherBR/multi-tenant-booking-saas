import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import './LoginPage.css';
import logo from "../assets/logo_png.png";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { slug } = useParams();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();



    try {
      const success = await login({ slug, username, password });

      if (success) {
        alert("login sucesso");

        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));

        console.log("DEBUG LOGIN:", payload);

        if (payload.isProfessional) {
          navigate('/professional');
        } else {
          navigate('/');
        }
      }

    } catch (err) {
      alert("erro no login");
    }
  }

  return (
    <div className="login-page">

      <div className="card container-main">

        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={logo}
            alt="Agendare"
            style={{
              width: "120px",
              opacity: 0.9
            }}
          />
        </div>

        <h2 className="heading text-center">
          Acesso do administrador
        </h2>

        <p className="subtext text-center">
          Faça login para continuar
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field mb-10"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field mb-20"
          />

          <button type="submit" className="button-primary">
            Entrar
          </button>

        </form>

        {error && (
          <p className="text-error text-center mt-10">
            {error}
          </p>
        )}

      </div>

    </div>
  );
}

export default LoginPage;