import { useState } from "react";
import SelectionCard from "./SelectionCard";

export default function CreateScheduleBlockModal({
    isOpen,
    onClose
}) {
    const [scope, setScope] = useState(null);
    const [mode, setMode] = useState(null);
    const [timeScope, setTimeScope] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");


    function handleClose() {
        setScope(null);
        setMode(null);
        setTimeScope(null);

        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div
                className="modal-content modal-content--scrollable"
                style={{
                    maxWidth: "500px",
                    maxHeight: "90vh"
                }}
            >

                <button
                    className="button-icon"
                    onClick={handleClose}
                >
                    ✕
                </button>

                <SelectionCard
                    title="Todos os profissionais"
                    description="Bloqueia horários para toda a agenda"
                    selected={scope === "global"}
                    onClick={() => setScope("global")}
                />

                {scope !== "global" && (
                    <SelectionCard
                        title="Profissional específico"
                        description="Bloqueia horários apenas de um profissional"
                        selected={scope === "professional"}
                        onClick={() => setScope("professional")}
                    />
                )}

                {scope === "global" && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Como o bloqueio funciona?</h3>

                        <SelectionCard
                            title="Bloqueio pontual"
                            description="Bloqueia datas específicas"
                            selected={mode === "single"}
                            onClick={() => setMode("single")}
                        />

                        {mode !== "single" && (
                            <SelectionCard
                                title="Bloqueio recorrente"
                                description="Bloqueia horários recorrentes na agenda"
                                selected={mode === "recurring"}
                                onClick={() => setMode("recurring")}
                            />
                        )}

                    </div>
                )}

                {mode && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Qual a duração do bloqueio?</h3>

                        <SelectionCard
                            title="Dia inteiro"
                            description="Bloqueia todos os horários do período"
                            selected={timeScope === "full_day"}
                            onClick={() => setTimeScope("full_day")}
                        />

                        {timeScope !== "full_day" && (
                            <SelectionCard
                                title="Horário específico"
                                description="Bloqueia apenas um intervalo de horário"
                                selected={timeScope === "time_range"}
                                onClick={() => setTimeScope("time_range")}
                            />
                        )}

                    </div>
                )}

                {timeScope === "full_day" && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Quando o bloqueio deve acontecer?</h3>

                        <input
                            type="date"
                            className="input-field"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />

                    </div>
                )}

            </div>
        </div>
    );
}