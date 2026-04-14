import { useState } from "react";
import apiClient from "../api/apiClient";

export default function AvailabilityModal({
    slug,
    professional,
    service,
    onBack,
    onClose,
    onSelect
}) {
    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchAvailability(selectedDate) {
        // 🔥 VALIDAÇÃO CORRETA (AGORA COM SLUG)
        if (!service || !service.slug) {
            console.error("Service inválido:", service);
            return;
        }

        if (!professional || !professional.slug) {
            console.error("Professional inválido:", professional);
            return;
        }

        if (!selectedDate) {
            console.error("Data inválida");
            return;
        }

        try {
            setLoading(true);

            console.log("🔍 Request:", {
                slug,
                professional: professional.slug,
                serviceSlug: service.slug,
                date: selectedDate
            });

            const data = await apiClient(
                `/agendar/${slug}/profissionais/${professional.slug}/disponibilidade?date=${selectedDate}&serviceSlug=${service.slug}`
            );

            // 🔥 CORREÇÃO CRÍTICA
            setSlots(data.slots || []);
        } catch (err) {
            console.error("Erro ao buscar horários:", err);
            setSlots([]);
        } finally {
            setLoading(false);
        }
    }

    function handleDateChange(e) {
        const selectedDate = e.target.value;
        setDate(selectedDate);
        fetchAvailability(selectedDate);
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px"
                }}>

                    <button
                        onClick={onBack}
                        style={{
                            background: "#0F172A",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "999px",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        ← Voltar
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "18px",
                            cursor: "pointer",
                            color: "#666"
                        }}
                    >
                        ✕
                    </button>

                </div>

                <h3>
                    {professional?.name} - {service?.name}
                </h3>

                {/* CALENDÁRIO */}
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    style={{ marginBottom: "15px", padding: "8px" }}
                />

                {/* LOADING */}
                {loading && <p>Carregando horários...</p>}

                {/* HORÁRIOS */}
                {!loading && slots.length === 0 ? (
                    <p>Selecione uma data para ver horários</p>
                ) : (
                    <ul>
                        {slots.map((slot, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    console.log("🔥 SLOT:", slot);

                                    onSelect({
                                        ...slot,
                                        date
                                    });
                                }}
                                style={{
                                    cursor: "pointer",
                                    marginBottom: "10px",
                                    padding: "8px",
                                    border: "1px solid #ccc"
                                }}
                            >
                                {slot.startTime}
                            </li>
                        ))}
                    </ul>
                )}

                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const modalStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px",
    position: "relative"
};