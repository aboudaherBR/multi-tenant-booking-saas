import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../hooks/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function loadDashboard() {
        try {
            const data = await apiClient("/dashboard/today");
            setStats(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar dashboard");
        } finally {
            setLoading(false);
        }
    }

    // 🔹 carga inicial
    useEffect(() => {
        loadDashboard();
    }, []);

    // 🔥 polling (produção real)
    useEffect(() => {

        const interval = setInterval(() => {
            loadDashboard();
        }, 5000);

        return () => clearInterval(interval);

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