import { useState } from "react";
import SelectionCard from "./SelectionCard";

export default function CreateScheduleBlockModal({
    isOpen,
    onClose
}) {
    const [scope, setScope] = useState(null);


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

            </div>
        </div>
    );
}