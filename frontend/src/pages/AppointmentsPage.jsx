import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

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
        loadAppointments(date);
    }, [date, selectedProfessional]);

    useEffect(() => {
        const interval = setInterval(() => {
            loadAppointments(date);
        }, 5000);

        return () => clearInterval(interval);
    }, [date, selectedProfessional]);

    async function loadProfessionals() {
        try {
            const data = await apiClient("/professionals");
            setProfessionals(data);
        } catch (error) {
            console.error("Erro ao carregar profissionais:", error);
        }
    }

    async function loadAppointments(date) {
        try {
            let url = `/appointments?date=${date}`;

            if (selectedProfessional !== "all") {
                url += `&professionalId=${selectedProfessional}`;
            }

            const data = await apiClient(url);
            setAppointments(data);

        } catch (error) {
            console.error("Erro ao carregar agendamentos:", error);
            setAppointments([]);
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>

            {/* HEADER */}
            <div className="header-gradient" style={{
                height: "80px",
            }}>
                <h2 style={{ color: "white" }}>  
                    Agendamentos
                </h2>
            </div>

            {/* FILTROS */}
            <div className="container-main" >

                <div className="card" style={{
                    alignItems: "center"
                }} >

                    <h2 className="heading">Filtros</h2>

                    <div className="mb-10">
                        <button
                            className="button-secondary"
                            onClick={() => navigate("/")}
                        >
                            Voltar ao início
                        </button>
                    </div>

                    <div className="mb-10">
                        <p style={{marginBottom: "8px"}}>Escolha o dia</p>
                        <input
                            type="date"
                            className="input-field"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <p style={{marginBottom: "8px"}}>Escolha por profissional</p>
                        <select
                            className="input-field"
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

                </div>

            </div>

            {/* AGENDA */}
            <div className="container-main">

                <div className="card" style={{ padding: "20px" }}>

                    <h2 className="heading">Agenda</h2>

                    {appointments.length === 0 ? (
                        <p className="text-muted">
                            Nenhum agendamento para este dia
                        </p>
                    ) : (
                        <div>
                            {appointments.map((a) => (
                                <div
                                    key={a.id}
                                    className="mb-10"
                                    style={{
                                        padding: "12px",
                                        borderRadius: "var(--radius)",
                                        background: "#f8fafc",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setSelectedAppointment(a)}
                                >
                                    <strong>{a.start_time}</strong>

                                    <div>{a.client_name}</div>

                                    <div className="text-muted">
                                        {a.service_name} — {a.professional_name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>

            {/* MODAL */}
            {selectedAppointment && (
                <div className="modal-backdrop">

                    <div className="modal-content">

                        <h3>Agendamento</h3>

                        <p><b>Cliente:</b> {selectedAppointment.client_name}</p>
                        <p><b>Serviço:</b> {selectedAppointment.service_name}</p>
                        <p><b>Profissional:</b> {selectedAppointment.professional_name}</p>
                        <p><b>Horário:</b> {selectedAppointment.start_time}</p>

                        <button
                            className="button-primary mb-10"
                            onClick={handleCancel}
                        >
                            Cancelar agendamento
                        </button>

                        <button
                            className="button-secondary"
                            onClick={() => setSelectedAppointment(null)}
                        >
                            Fechar
                        </button>

                    </div>

                </div>
            )}

        </div>
    );

    async function handleCancel() {
        await apiClient(`/appointments/${selectedAppointment.id}`, {
            method: "DELETE"
        });

        setSelectedAppointment(null);
        loadAppointments(date);
    }
}