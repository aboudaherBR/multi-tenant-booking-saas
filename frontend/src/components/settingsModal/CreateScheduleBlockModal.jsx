import { useState, useEffect } from "react";

export default function CreateScheduleBlockModal({
    isOpen,
    onClose,
    professionals
}) {
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [blockType, setBlockType] = useState("global");
    const [selectedProfessionalId, setSelectedProfessionalId] = useState("");

    const [blockMode, setBlockMode] = useState("single");

    const [validFrom, setValidFrom] = useState("");
    const [validTo, setValidTo] = useState("");

    const [recurringDays, setRecurringDays] = useState([]);
    const [recurringStartTime, setRecurringStartTime] = useState("");
    const [recurringEndTime, setRecurringEndTime] = useState("");
    const [timeScope, setTimeScope] = useState("time_range");

    useEffect(() => {
        if (timeScope === "full_day") {
            setRecurringStartTime("");
            setRecurringEndTime("");
            setEndDateTime("");
        }
    }, [timeScope]);



    function handleSave() {
        console.log("HANDLE SAVE FOI CHAMADO");

        // 🔥 VALIDAÇÕES BÁSICAS
        if (blockMode === "single") {
            if (!startDateTime || !endDateTime) {
                alert("Preencha início e fim do bloqueio");
                return;
            }
        }

        if (blockMode === "recurring") {
            if (!recurringStartTime || !recurringEndTime) {
                alert("Preencha o horário do bloqueio recorrente");
                return;
            }

            if (blockMode === "recurring") {
                if (recurringStartTime >= recurringEndTime) {
                    alert("Horário inicial deve ser menor que o final");
                    return;
                }
            }

            if (recurringDays.length === 0) {
                alert("Selecione pelo menos um dia da semana");
                return;
            }
        }


        const payload = {
            mode: blockMode,

            valid_from: validFrom || null,
            valid_to: validTo || null,

            start_datetime: blockMode === "single" ? startDateTime : null,
            end_datetime: blockMode === "single" ? endDateTime : null,

            recurring_days: blockMode === "recurring" ? recurringDays : [],
            recurring_start_time: blockMode === "recurring" ? recurringStartTime : null,
            recurring_end_time: blockMode === "recurring" ? recurringEndTime : null,

            scope: blockType,
            professional_id:
                blockType === "professional" ? selectedProfessionalId : null
        };

        console.log("PAYLOAD FINAL:", payload);
    }

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content modal-content--scrollable">

                {/* HEADER */}
                <div className="modal-header">
                    <h3 className="heading">Novo bloqueio</h3>

                    <button className="button-icon" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <p className="text-muted">
                    Aqui você criará um novo bloqueio.
                </p>

                {/* TIPO (PONTUAL / RECORRENTE) */}
                <div style={{ marginTop: "16px" }}>
                    <h4 className="heading" style={{ fontSize: "16px" }}>
                        Tipo de bloqueio
                    </h4>

                    <div style={{ marginTop: "10px", display: "flex", gap: "12px" }}>
                        <label style={{ display: "flex", gap: "6px" }}>
                            <input
                                type="radio"
                                checked={blockMode === "single"}
                                onChange={() => setBlockMode("single")}
                            />
                            Pontual
                        </label>

                        <label style={{ display: "flex", gap: "6px" }}>
                            <input
                                type="radio"
                                checked={blockMode === "recurring"}
                                onChange={() => setBlockMode("recurring")}
                            />
                            Recorrente
                        </label>
                    </div>
                </div>

                {/* ESCOPO DE HORÁRIO */}
                <div style={{ marginTop: "16px" }}>
                    <h4 className="heading" style={{ fontSize: "16px" }}>
                        Escopo de horário
                    </h4>

                    <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                        <label style={{ display: "flex", gap: "6px" }}>
                            <input
                                type="radio"
                                checked={timeScope === "full_day"}
                                onChange={() => setTimeScope("full_day")}
                            />
                            Dia inteiro
                        </label>

                        <label style={{ display: "flex", gap: "6px" }}>
                            <input
                                type="radio"
                                checked={timeScope === "time_range"}
                                onChange={() => setTimeScope("time_range")}
                            />
                            Intervalo de tempo
                        </label>
                    </div>
                </div>

                {/* VALIDADE */}
                <div style={{ marginTop: "16px" }}>
                    <h4 className="heading" style={{ fontSize: "16px" }}>
                        Período de aplicação (opcional)
                    </h4>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                        <input
                            type="date"
                            className="input-field"
                            value={validFrom}
                            onChange={(e) => setValidFrom(e.target.value)}
                        />

                        <input
                            type="date"
                            className="input-field"
                            value={validTo}
                            onChange={(e) => setValidTo(e.target.value)}
                        />
                    </div>
                </div>

                {/* CONTEÚDO - PONTUAL */}
                {blockMode === "single" && (
                    <div style={{ marginTop: "16px" }}>
                        <h4 className="heading" style={{ fontSize: "16px" }}>
                            Data do bloqueio
                        </h4>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                            <input
                                type="datetime-local"
                                className="input-field"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                            />

                            {timeScope === "time_range" && (
                                <input
                                    type="datetime-local"
                                    className="input-field"
                                    value={endDateTime}
                                    onChange={(e) => setEndDateTime(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* CONTEÚDO - RECORRENTE */}
                {blockMode === "recurring" && (
                    <>
                        <div style={{ marginTop: "16px" }}>
                            <h4 className="heading" style={{ fontSize: "16px" }}>
                                Horário
                            </h4>

                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <input
                                    type="time"
                                    className="input-field"
                                    value={recurringStartTime}
                                    onChange={(e) => setRecurringStartTime(e.target.value)}
                                />

                                <input
                                    type="time"
                                    className="input-field"
                                    value={recurringEndTime}
                                    onChange={(e) => setRecurringEndTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <h4 className="heading" style={{ fontSize: "16px" }}>
                                Dias da semana
                            </h4>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                    <label key={day} style={{ display: "flex", gap: "4px" }}>
                                        <input
                                            type="checkbox"
                                            checked={recurringDays.includes(day)}
                                            onChange={() => {
                                                if (recurringDays.includes(day)) {
                                                    setRecurringDays(recurringDays.filter(d => d !== day));
                                                } else {
                                                    setRecurringDays([...recurringDays, day]);
                                                }
                                            }}
                                        />
                                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][day]}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* GLOBAL / PROFISSIONAL */}
                <div style={{ marginTop: "16px" }}>
                    <h4 className="heading" style={{ fontSize: "16px" }}>
                        Escopo
                    </h4>

                    <div style={{ marginTop: "10px", display: "flex", gap: "12px" }}>
                        <label>
                            <input
                                type="radio"
                                checked={blockType === "global"}
                                onChange={() => setBlockType("global")}
                            />
                            Global
                        </label>

                        <label>
                            <input
                                type="radio"
                                checked={blockType === "professional"}
                                onChange={() => setBlockType("professional")}
                            />
                            Por profissional
                        </label>
                    </div>
                </div>

                {blockType === "professional" && (
                    <div style={{ marginTop: "16px" }}>
                        <select
                            className="input-field"
                            value={selectedProfessionalId}
                            onChange={(e) => setSelectedProfessionalId(e.target.value)}
                        >
                            <option value="">Selecione um profissional</option>

                            {professionals?.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* BOTÃO */}
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <button className="button-primary" onClick={handleSave}>
                        Salvar
                    </button>
                </div>

            </div>
        </div>
    );
}