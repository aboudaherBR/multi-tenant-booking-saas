import { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function ProfessionalDashboard() {
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
      <h1>Olá</h1>

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