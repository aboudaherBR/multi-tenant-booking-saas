import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useAuth } from "../hooks/AuthContext";

export default function ProfessionalDashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  async function fetchAppointments() {
    try {
      const data = await api("/professional/me/appointments");
      setData(data);
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

      <h2 style={{ marginTop: 20 }}>
        Agendamentos de hoje — R$ {data.totalAmount || 0}
      </h2>

      <div style={{ marginTop: 20 }}>
        <h3>Agendamentos</h3>

        {data.appointments.length === 0 ? (
          <p>Nenhum agendamento hoje</p>
        ) : (
          <ul>
            {data.appointments.map((appt) => (
              <li key={appt.id}>
                <strong>{appt.start_time}</strong> — {appt.client_name} ({appt.service_name})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔥 BOTÕES */}
      <div style={{ marginTop: 30, display: "flex", gap: 10 }}>
        <button onClick={() => alert("Relatórios (em breve)")}>
          Relatórios
        </button>

        <button onClick={() => alert("Agenda (em breve)")}>
          Agenda
        </button>
      </div>
    </div>
  );
}