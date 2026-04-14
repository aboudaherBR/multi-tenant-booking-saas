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
    const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);

        return {
            date: d,
            label: d.toLocaleDateString("pt-BR", { weekday: "short" }).toUpperCase(),
            day: String(d.getDate()).padStart(2, "0")
        };
    });

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
    const [selectedSlot, setSelectedSlot] = useState(null);

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
                        Voltar
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
                <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
                    Escolha uma data
                </p>

                <div style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    marginBottom: "15px",
                    paddingBottom: "5px",
                    scrollBehavior: "smooth"
                }}>
                    {days.map((d, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                const formatted = `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, "0")}-${d.day}`;
                                setDate(formatted);
                                fetchAvailability(formatted);
                            }}
                            style={{
                                minWidth: "60px",
                                padding: "10px",
                                borderRadius: "10px",
                                textAlign: "center",
                                cursor: "pointer",
                                border: date === `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, "0")}-${d.day}`
                                    ? "none"
                                    : "1px solid #e5e7eb",
                                background: date === `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, "0")}-${d.day}`
                                    ? "#0F172A"
                                    : "#fff",
                                color: date === `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, "0")}-${d.day}`
                                    ? "#fff"
                                    : "#0F172A",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <div style={{ fontSize: "12px" }}>{d.label}</div>
                            <div style={{ fontWeight: "bold" }}>{d.day}</div>
                        </div>
                    ))}
                </div>


                {/* LOADING */}
                {loading && <p>Carregando horários...</p>}

                {/* HORÁRIOS */}
                {!loading && slots.length === 0 ? (
                    <p>Selecione uma data para ver horários</p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "10px"
                        }}
                    >
                        {slots.map((slot, index) => {
                            const isSelected =
                                selectedSlot?.startTime === slot.startTime;

                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        console.log("🔥 SLOT:", slot);
                                        setSelectedSlot(slot);
                                        onSelect({
                                            ...slot,
                                            date
                                        });
                                    }}
                                    style={{
                                        padding: "12px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        background: isSelected ? "#0F172A" : "#fff",
                                        color: isSelected ? "#fff" : "#0F172A",
                                        border: isSelected ? "none" : "1px solid #e5e7eb",
                                        boxShadow: isSelected
                                            ? "0 8px 20px rgba(0,0,0,0.25)"
                                            : "none",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {slot.startTime}
                                </div>
                            );
                        })}
                    </div>
                )}


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
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    maxHeight: "85vh",
    overflowY: "auto",
    position: "relative"
};