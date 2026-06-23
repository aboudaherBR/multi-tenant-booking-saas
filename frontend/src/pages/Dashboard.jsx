import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../hooks/AuthContext";
import BookingLinkCard from "../components/BookingLinkCard";
import useTheme from "../hooks/useTheme";
import ThemeToggle from "../components/ui/ThemeToggle";


export default function Dashboard() {
    const { user } = useAuth();
    console.log("STEP 1 - USER:", user);
    console.log("STEP 1 - SLUG:", user?.companySlug);

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
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

    useEffect(() => {
        loadDashboard();
    }, []);

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
            <div className="container-main" style={{ marginTop: "-40px" }}>

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

                    {!stats?.services || stats.services.length === 0 ? (
                        <p className="text-muted">
                            Nenhum serviço realizado hoje
                        </p>
                    ) : (
                        <div className="services-grid">
                            {stats.services.map((service, index) => (
                                <div key={index} className="service-item">
                                    <span>{service.name}</span>
                                    <strong>{"  "}{service.count}</strong>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <BookingLinkCard companySlug={user?.companySlug} />
                <div
                    style={{
                        bottom: "70px", // acima do menu inferior
                        left: 0,
                        width: "100%",
                        padding: "10px 16px",
                        background: "transparent"
                    }}
                >
                    <button
                        className="button-primary"
                        onClick={() => navigate('/reports')}
                    >
                        Ver relatórios
                    </button>
                </div>

            </div>




        </div>
    );
}