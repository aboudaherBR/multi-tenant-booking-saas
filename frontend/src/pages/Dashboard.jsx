import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../hooks/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function loadDashboard() {
        try {
            const data = await apiClient("/dashboard/today");

            // 🔥 garante que é array
            setAppointments(Array.isArray(data) ? data : []);
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

    // 🔥 polling
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

            {/* 🔥 agora correto */}
            <p>Atendimentos: {appointments.length}</p>

            <h2>Agendamentos</h2>

            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment.id}>
                        {new Date(appointment.date).toLocaleDateString()} — {appointment.start_time}
                    </li>
                ))}
            </ul>

            <button onClick={() => navigate('/reports')}>
                Relatórios
            </button>
        </div>
    );
}