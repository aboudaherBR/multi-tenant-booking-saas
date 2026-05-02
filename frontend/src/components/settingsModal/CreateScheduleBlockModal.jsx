import { useState } from "react";


export default function CreateScheduleBlockModal({
    isOpen,
    onClose
}) {
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [blockType, setBlockType] = useState("global");
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
                    <div style={{ marginTop: "16px" }}>
                        <h4 className="heading" style={{ fontSize: "16px" }}>
                            Tipo de bloqueio
                        </h4>

                        <div style={{ marginTop: "10px", display: "flex", gap: "12px" }}>

                            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <input
                                    type="radio"
                                    checked={blockType === "global"}
                                    onChange={() => setBlockType("global")}
                                />
                                Global
                            </label>

                            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <input
                                    type="radio"
                                    checked={blockType === "professional"}
                                    onChange={() => setBlockType("professional")}
                                />
                                Por profissional
                            </label>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}