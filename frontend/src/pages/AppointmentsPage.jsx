import { useEffect, useState } from "react";

export default function AppointmentsPage() {

    const [professionals, setProfessionals] = useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState("all");
    const [appointments, setAppointments] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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
        const response = await fetch("http://localhost:3000/professionals", {
            credentials: "include"
        });

        const data = await response.json();
        setProfessionals(data);


    }

    async function loadAppointments() {

        let url = `http://localhost:3000/appointments?date=${date}`;

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
                    <li key={a.id}>
                        {a.start_time} — {a.client_name} ({a.service_name})
                    </li>
                ))}
            </ul>

        </div>
    );
}