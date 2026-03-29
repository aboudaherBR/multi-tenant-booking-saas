import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useAuth } from "../hooks/AuthContext";

export default function ProfessionalDashboard() {
  console.log("PROFESSIONAL NOVO CARREGADO");
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

  if (data.appointments.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Olá</h1>
        <h2>Nenhum agendamento hoje</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Olá, {user?.name}</h1>

      <h2>
        Agendamentos de hoje — R$ {data.totalAmount}
      </h2>

      <ul>
        {data.appointments.map((appt) => (
          <li key={appt.id}>
            {appt.start_time} - {appt.client_name} ({appt.service_name})
          </li>
        ))}
      </ul>
    </div>
  );
}