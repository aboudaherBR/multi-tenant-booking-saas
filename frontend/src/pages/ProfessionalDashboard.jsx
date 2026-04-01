import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfessionalDashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
  }, []);

  if (!data) return <div>Carregando...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Olá, {user?.name}</h1>

      <h2 style={{ marginTop: 20 }}>
        Agendamentos de hoje — R$ {Number(data.totalAmount || 0).toFixed(2)}
      </h2>

      <div style={{ marginTop: 20 }}>
        <h3>Agendamentos</h3>

        {(data.appointments || []).length === 0 ? (
          <p>Nenhum agendamento hoje</p>
        ) : (
          <ul>
            {data.appointments.map((appt) => (
              <li key={appt.id}>
                <strong>{appt.start_time?.slice(0, 5)}</strong> —{" "}
                {appt.client_name} ({appt.service_name})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* BOTÕES */}
      <div style={{ marginTop: 30, display: "flex", gap: 10 }}>
        <button onClick={() => alert("Relatórios (em breve)")}>
          Relatórios
        </button>

        <button onClick={() => navigate("/professional/schedule")}>
          Agenda
        </button>
      </div>
    </div>
  );
}