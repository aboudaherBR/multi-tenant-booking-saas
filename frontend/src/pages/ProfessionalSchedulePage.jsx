import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

export default function ProfessionalSchedulePage() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const navigate = useNavigate();

  async function fetchAppointments() {
    try {
      const data = await api(
        `/professional/me/appointments?date=${date}`
      );
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Erro ao buscar agenda:", error);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, [date]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Agenda</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/professional")}>
          ← Dashboard
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Data: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {(appointments || []).length === 0 ? (
        <p>Nenhum agendamento</p>
      ) : (
        <ul>
          {appointments.map((appt) => (
            <li key={appt.id}>
              <strong>{appt.start_time?.slice(0, 5)}</strong> —{" "}
              {appt.client_name} ({appt.service_name})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}