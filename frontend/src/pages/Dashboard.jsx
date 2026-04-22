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
        <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>

            {/* HEADER */}
            <div className="header-gradient">
                <h2 style={{ color: "white" }}>
                    Olá, {user?.name}
                </h2>
            </div>

            {/* CONTEÚDO */}
            <div className="container-main">

                <div className="card" style={{ padding: "20px" }}>

                    <h2 className="heading">Hoje</h2>

                    <div className="mb-20">
                        <p className="text-row">
                            <strong>Atendimentos:</strong> {stats?.totalAppointments}
                        </p>

                        <p className="text-row">
                            <strong>Faturamento:</strong>{" "}
                            R$ {Number(stats?.totalRevenue || 0).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2
                            })}
                        </p>
                    </div>

                    <h2 className="heading">Serviços</h2>

                    <ul style={{ paddingLeft: "16px" }}>
                        {stats?.services?.map((service, index) => (
                            <li key={index} className="text-row">
                                {service.name} — {service.count}
                            </li>
                        ))}
                    </ul>

                    <button
                        className="button-primary mt-20"
                        onClick={() => navigate('/reports')}
                    >
                        Ver relatórios
                    </button>

                </div>

            </div>

        </div>
    );
}