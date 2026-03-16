import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        async function loadDashboard() {
            try {

                // Buscar sessão do usuário
                const sessionResponse = await fetch("http:///api/auth/me", {
                    credentials: "include",
                });

                const sessionData = await sessionResponse.json();
                setUser(sessionData);

                // Buscar dados do dashboard
                const response = await fetch("http:///api/dashboard/today", {
                    credentials: "include",
                });

                const data = await response.json();
                setStats(data);

            } catch (err) {
                console.error(err);
                setError("Erro ao carregar dashboard");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();

    }, []);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Olá, {user?.name}</h1>

            <h2>Hoje</h2>

            <p>Atendimentos: {stats?.totalAppointments}</p>
            <p>Faturamento: R$ {stats?.totalRevenue}</p>

            <h2>Serviços</h2>

            <ul>
                {stats?.services?.map((service, index) => (
                    <li key={index}>
                        {service.name} — {service.count}
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/reports')}>
                Relatórios
            </button>
        </div>
    );
}