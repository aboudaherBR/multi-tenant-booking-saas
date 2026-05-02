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
                <div style={{ marginTop: "16px" }}>
                    <h4 className="heading" style={{ fontSize: "16px" }}>
                        Período
                    </h4>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            marginTop: "10px"
                        }}
                    >
                        <input
                            type="datetime-local"
                            className="input-field"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                        />

                        <input
                            type="datetime-local"
                            className="input-field"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}