import { useState } from "react";
import SelectionCard from "./SelectionCard";

export default function CreateScheduleBlockModal({
    isOpen,
    onClose
}) {
    const [scope, setScope] = useState(null);
    const [mode, setMode] = useState(null);


    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">

                <button
                    className="button-icon"
                    onClick={onClose}
                >
                    ✕
                </button>

                <SelectionCard
                    title="Todos os profissionais"
                    description="Bloqueia horários para toda a agenda"
                    selected={scope === "global"}
                    onClick={() => setScope("global")}
                />

                <SelectionCard
                    title="Profissional específico"
                    description="Bloqueia horários apenas de um profissional"
                    selected={scope === "professional"}
                    onClick={() => setScope("professional")}
                />

                {scope === "global" && (
                    <div style={{ marginTop: "24px" }}>

                        <h3>Como o bloqueio funciona?</h3>

                        <SelectionCard
                            title="Bloqueio pontual"
                            description="Bloqueia datas específicas"
                            selected={mode === "single"}
                            onClick={() => setMode("single")}
                        />

                        <SelectionCard
                            title="Bloqueio recorrente"
                            description="Bloqueia horários recorrentes na agenda"
                            selected={mode === "recurring"}
                            onClick={() => setMode("recurring")}
                        />

                    </div>
                )}

            </div>
        </div>
    );
}