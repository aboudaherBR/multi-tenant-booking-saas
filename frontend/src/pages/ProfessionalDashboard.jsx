import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { useAuth } from "../hooks/AuthContext";

export default function ProfessionalDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);

  async function fetchAppointments() {
    try {
      const res = await api("/professional/me/appointments");
      setData(res);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  }

  useEffect(() => {
    fetchAppointments();

    const interval = setInterval(fetchAppointments, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Carregando...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Olá, {user?.name}</h1>

      <h2>
        Agendamentos de hoje — R$ {data.totalAmount}
      </h2>

      {/* 🔥 BOTÕES */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <button onClick={() => navigate('/appointments')}>
          Agenda
        </button>

        <button
          style={{ marginLeft: 10 }}
          onClick={() => navigate('/reports')}
        >
          Relatórios
        </button>
      </div>

      {data.appointments.length === 0 ? (
        <p>Nenhum agendamento hoje</p>
      ) : (
        <ul>
          {data.appointments.map((appt) => (
            <li key={appt.id}>
              {appt.start_time} - {appt.client_name} ({appt.service_name})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}