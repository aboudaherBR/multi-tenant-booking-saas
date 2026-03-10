import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SettingsPage() {

    const navigate = useNavigate();

    const [showBusinessHoursModal, setShowBusinessHoursModal] = useState(false);
    const [businessHours, setBusinessHours] = useState([]);

    const weekdayNames = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
    ];

    async function loadBusinessHours() {

        const response = await fetch(
            "http://localhost:3000/business-hours",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        const days = [];

        for (let i = 0; i <= 6; i++) {

            const existing = data.find(d => d.weekday === i);

            if (existing) {
                days.push(existing);
            } else {
                days.push({
                    weekday: i,
                    start_time: "09:00:00",
                    end_time: "18:00:00",
                    is_active: false
                });
            }

        }

        setBusinessHours(days);
    }

    async function openBusinessHoursModal() {
        await loadBusinessHours();
        setShowBusinessHoursModal(true);
    }

    async function saveBusinessHours() {

        await fetch(
            "http://localhost:3000/business-hours",
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    hours: businessHours
                })
            }
        );

        setShowBusinessHoursModal(false);
    }

    return (
        <div>

            <div>
                <h1>Configurações</h1>

                <h2>Agenda</h2>

                <button onClick={openBusinessHoursModal}>
                    Horário de funcionamento
                </button>

                <button onClick={() => navigate("/schedule-blocks")}>
                    Bloquear horário
                </button>

                <h2>Cadastros</h2>

                <button onClick={() => navigate("/professionals")}>
                    Profissionais
                </button>

                <button onClick={() => navigate("/services")}>
                    Serviços
                </button>
            </div>

            <button onClick={() => navigate("/")}>
                Voltar ao Dashboard
            </button>

            {showBusinessHoursModal && (
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

                        <h3>Horário de funcionamento</h3>

                        <p>Aqui vamos configurar os horários da empresa.</p>
                        {businessHours.map((day) => (
                            <div key={day.weekday} style={{ marginBottom: "10px" }}>

                                <strong>{weekdayNames[day.weekday]}</strong>

                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>

                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={day.is_active}
                                            onChange={(e) => {
                                                const updated = businessHours.map((d) =>
                                                    d.weekday === day.weekday
                                                        ? { ...d, is_active: e.target.checked }
                                                        : d
                                                );
                                                setBusinessHours(updated);
                                            }}
                                        />
                                        Aberto
                                    </label>

                                    <input
                                        type="time"
                                        value={day.start_time.slice(0, 5)}
                                        disabled={!day.is_active}
                                        onChange={(e) => {
                                            const updated = businessHours.map((d) =>
                                                d.weekday === day.weekday
                                                    ? { ...d, start_time: e.target.value + ":00" }
                                                    : d
                                            );
                                            setBusinessHours(updated);
                                        }}
                                    />

                                    <span>até</span>

                                    <input
                                        type="time"
                                        value={day.end_time.slice(0, 5)}
                                        disabled={!day.is_active}
                                        onChange={(e) => {
                                            const updated = businessHours.map((d) =>
                                                d.weekday === day.weekday
                                                    ? { ...d, end_time: e.target.value + ":00" }
                                                    : d
                                            );
                                            setBusinessHours(updated);
                                        }}
                                    />

                                </div>

                            </div>
                        ))}

                        <button onClick={saveBusinessHours}>
                            Salvar horários
                        </button>

                        <button onClick={() => setShowBusinessHoursModal(false)}>
                            Fechar
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}