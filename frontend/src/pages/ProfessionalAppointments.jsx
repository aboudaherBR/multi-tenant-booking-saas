import { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function ProfessionalAppointments() {
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
  }, []);

  if (!data) return <div>Carregando...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Agenda do Profissional</h1>

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