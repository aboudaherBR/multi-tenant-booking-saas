import { useState } from "react";


export default function CreateScheduleBlockModal({
    isOpen,
    onClose
}) {
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    if (!isOpen) return null;

    

    return (
        <div className="modal-backdrop">
            <div className="modal-content">

                <div className="modal-header">
                    <h3 className="heading">Novo bloqueio</h3>

                    <button
                        className="button-icon"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <p className="text-muted">
                    Aqui você criará um novo bloqueio.
                </p>

            </div>
        </div>
    );
}