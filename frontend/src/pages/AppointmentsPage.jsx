import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AppointmentsPage() {

    const navigate = useNavigate();
    const [professionals, setProfessionals] = useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState("all");
    const [appointments, setAppointments] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    function goToYesterday() {
        const d = new Date(date);
        d.setDate(d.getDate() - 1);
        setDate(d.toISOString().split("T")[0]);
    }



    useEffect(() => {
        loadProfessionals();
    }, []);

    useEffect(() => {
        loadAppointments();
    }, [date, selectedProfessional]);

    async function loadProfessionals() {
        const response = await fetch("http:///api/professionals", {
            credentials: "include"
        });

        const data = await response.json();
        setProfessionals(data);


    }

    async function loadAppointments() {

        let url = `http:///api/appointments?date=${date}`;

        if (selectedProfessional !== "all") {
            url += `&professionalId=${selectedProfessional}`;
        }

        const response = await fetch(url, {
            credentials: "include"
        });

        const data = await response.json();
        setAppointments(data);
    }

    return (
        <div>

            <h1>Agendamentos</h1>

            <button onClick={() => navigate("/")}>
                ← Dashboard
            </button>

            <button onClick={goToYesterday}>◀ Ontem</button>

            <div>
                <label>Data:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div>
                <label>Profissional:</label>
                <select
                    value={selectedProfessional}
                    onChange={(e) => setSelectedProfessional(e.target.value)}
                >

                    <option value="all">Todos</option>

                    {professionals.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}

                </select>
            </div>

            <h2>Agenda</h2>

            <ul>
                {appointments.map((a) => (
                    <li key={a.id} onClick={() => setSelectedAppointment(a)}>
                        {a.start_time} {a.professional_name} — {a.client_name} ({a.service_name})
                    </li>

                ))}
                {selectedAppointment && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <div style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            minWidth: "300px"
                        }}>

                            <h3>Agendamento</h3>

                            <p><b>Cliente:</b> {selectedAppointment.client_name}</p>
                            <p><b>Serviço:</b> {selectedAppointment.service_name}</p>
                            <p><b>Profissional:</b> {selectedAppointment.professional_name}</p>
                            <p><b>Horário:</b> {selectedAppointment.start_time}</p>

                            <button onClick={handleCancel}>Cancelar agendamento</button>
                            <button onClick={() => setSelectedAppointment(null)}>Fechar</button>

                        </div>
                    </div>
                )}
            </ul>

        </div>
    );

    async function handleCancel() {

        await fetch(
            `http:///api/appointments/${selectedAppointment.id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        setSelectedAppointment(null);
        loadAppointments();
    }
}