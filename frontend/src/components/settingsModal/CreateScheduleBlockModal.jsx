import { useState } from "react";
import SelectionCard from "./SelectionCard";
import apiClient from "../../api/apiClient";

export default function CreateScheduleBlockModal({
    isOpen,
    onClose,
    professionals
}) {
    const [scope, setScope] = useState(null);
    const [mode, setMode] = useState(null);
    const [timeScope, setTimeScope] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedProfessional, setSelectedProfessional] = useState("");
    const [selectedWeekdays, setSelectedWeekdays] = useState([]);


    function handleClose() {
        setScope(null);
        setMode(null);
        setTimeScope(null);

        setSelectedProfessional("");
        setSelectedDate("");

        onClose();
    }

    async function handleCreateBlock() {

        const payload = {
            mode: mode,

            time_scope: timeScope,

            start_datetime:
                timeScope === "full_day"
                    ? selectedDate
                    : `${selectedDate}T${startTime}`,

            end_datetime:
                timeScope === "full_day"
                    ? selectedDate
                    : `${selectedDate}T${endTime}`,

            professionalId:
                scope === "professional"
                    ? selectedProfessional
                    : null
        };

        console.log("PAYLOAD:", payload);

        await apiClient("/schedule-blocks", {
            method: "POST",
            body: payload
        });

        handleClose();
    }

    async function handleCreateRecurringBlock() {

        const payload = {
            mode: "recurring",
            time_scope: timeScope,
            recurring_days: selectedWeekdays,
            professionalId:
                scope === "professional"
                    ? selectedProfessional
                    : null
        };
        console.log("RECURRING PAYLOAD:", payload);

        await apiClient("/schedule-blocks", {
            method: "POST",
            body: payload
        });

        handleClose();
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

                {scope !== "professional" && (
                    <SelectionCard
                        title="Todos os profissionais"
                        description="Bloqueia horários para toda a agenda"
                        selected={scope === "global"}
                        onClick={() => setScope("global")}
                    />
                )}

                {scope !== "global" && (
                    <SelectionCard
                        title="Profissional específico"
                        description="Bloqueia horários apenas de um profissional"
                        selected={scope === "professional"}
                        onClick={() => setScope("professional")}
                    />
                )}

                {scope === "professional" && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Qual profissional deseja bloquear?</h3>

                        <select
                            className="input-field"
                            value={selectedProfessional}
                            onChange={(e) => setSelectedProfessional(e.target.value)}
                        >
                            <option value="">
                                Selecione um profissional
                            </option>

                            {professionals?.map((professional) => (
                                <option
                                    key={professional.id}
                                    value={professional.id}
                                >
                                    {professional.name}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {(scope === "global" || selectedProfessional) && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Como o bloqueio funciona?</h3>

                        {mode !== "recurring" && (
                            <SelectionCard
                                title="Bloqueio pontual"
                                description="Bloqueia datas específicas"
                                selected={mode === "single"}
                                onClick={() => setMode("single")}
                            />
                        )}

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

                        {timeScope !== "time_range" && (
                            <SelectionCard
                                title="Dia inteiro"
                                description="Bloqueia todos os horários do período"
                                selected={timeScope === "full_day"}
                                onClick={() => setTimeScope("full_day")}
                            />
                        )}

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

                {mode === "single" && timeScope === "full_day" && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Quando o bloqueio deve acontecer?</h3>

                        <input
                            type="date"
                            className="input-field"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />

                        <button
                            className="button-primary"
                            disabled={!selectedDate}
                            onClick={handleCreateBlock}
                            style={{
                                marginTop: "20px",
                                opacity: !selectedDate ? 0.5 : 1
                            }}
                        >
                            Bloquear agenda
                        </button>

                    </div>
                )}

                {mode === "recurring" && timeScope === "full_day" && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Quais dias deseja bloquear?</h3>

                        {[
                            { value: 0, label: "Domingo" },
                            { value: 1, label: "Segunda" },
                            { value: 2, label: "Terça" },
                            { value: 3, label: "Quarta" },
                            { value: 4, label: "Quinta" },
                            { value: 5, label: "Sexta" },
                            { value: 6, label: "Sábado" }
                        ].map((day) => (

                            <label
                                key={day.value}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginTop: "10px"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedWeekdays.includes(day.value)}
                                    onChange={(e) => {

                                        if (e.target.checked) {
                                            setSelectedWeekdays([
                                                ...selectedWeekdays,
                                                day.value
                                            ]);
                                        } else {
                                            setSelectedWeekdays(
                                                selectedWeekdays.filter(
                                                    (d) => d !== day.value
                                                )
                                            );
                                        }
                                    }}
                                />

                                {day.label}

                            </label>

                        ))}
                        <button
                            className="button-primary"
                            disabled={selectedWeekdays.length === 0}
                            onClick={handleCreateRecurringBlock}
                            style={{
                                marginTop: "20px",
                                opacity:
                                    selectedWeekdays.length === 0
                                        ? 0.5
                                        : 1
                            }}
                        >
                            Bloquear agenda
                        </button>

                    </div>
                )}

                {mode === "single" && timeScope === "time_range" && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Quando o bloqueio deve acontecer?</h3>

                        <input
                            type="date"
                            className="input-field"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />

                        <div style={{ marginTop: "12px" }}>

                            <label>Hora início</label>

                            <input
                                type="time"
                                className="input-field"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div style={{ marginTop: "12px" }}>

                            <label>Hora fim</label>

                            <input
                                type="time"
                                className="input-field"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>

                        <button
                            className="button-primary"
                            disabled={
                                !selectedDate ||
                                !startTime ||
                                !endTime
                            }
                            onClick={handleCreateBlock}
                            style={{
                                marginTop: "20px",
                                opacity:
                                    !selectedDate ||
                                        !startTime ||
                                        !endTime
                                        ? 0.5
                                        : 1
                            }}
                        >
                            Bloquear agenda
                        </button>

                    </div>
                )}

                {mode === "recurring" && timeScope === "time_range" && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Quais dias e horários deseja bloquear?</h3>

                    </div>
                )}

            </div>
        </div>
    );
}