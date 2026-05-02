export default function BusinessHoursModal({
    isOpen,
    onClose,
    businessHours,
    weekdayNames,
    setBusinessHours,
    lunchStart,
    lunchEnd,
    setLunchStart,
    setLunchEnd,
    bufferMinutes,
    setBufferMinutes,
    saveBusinessHours
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">

                <div className="modal-header">
                    <h3 className="heading">Horário de funcionamento</h3>

                    <button
                        className="button-icon"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {businessHours.map(day => (
                    <div key={day.weekday} style={{ marginBottom: "10px" }}>
                        <strong>{weekdayNames[day.weekday]}</strong>

                        <div style={{ display: "flex", gap: "8px" }}>

                            <input
                                type="checkbox"
                                checked={day.is_active}
                                onChange={(e) => {
                                    const updated = businessHours.map(d =>
                                        d.weekday === day.weekday
                                            ? { ...d, is_active: e.target.checked }
                                            : d
                                    );
                                    setBusinessHours(updated);
                                }}
                            />

                            <input
                                type="time"
                                value={day.start_time.slice(0, 5)}
                                disabled={!day.is_active}
                                onChange={(e) => {
                                    const updated = businessHours.map(d =>
                                        d.weekday === day.weekday
                                            ? { ...d, start_time: e.target.value + ":00" }
                                            : d
                                    );
                                    setBusinessHours(updated);
                                }}
                            />

                            <span>até</span>

                            <input
                                type="time"
                                value={day.end_time.slice(0, 5)}
                                disabled={!day.is_active}
                                onChange={(e) => {
                                    const updated = businessHours.map(d =>
                                        d.weekday === day.weekday
                                            ? { ...d, end_time: e.target.value + ":00" }
                                            : d
                                    );
                                    setBusinessHours(updated);
                                }}
                            />

                        </div>
                    </div>
                ))}

                <div style={{ marginTop: "15px" }}>
                    <strong>Horário de almoço</strong>

                    <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>

                        <input
                            type="time"
                            value={lunchStart}
                            onChange={(e) => setLunchStart(e.target.value)}
                        />

                        <span>até</span>

                        <input
                            type="time"
                            value={lunchEnd}
                            onChange={(e) => setLunchEnd(e.target.value)}
                        />

                        <button
                            style={{ marginTop: "5px" }}
                            onClick={() => {
                                setLunchStart("");
                                setLunchEnd("");
                            }}
                        >
                            Remover horário de almoço
                        </button>

                    </div>
                </div>

                <div style={{ marginTop: "15px" }}>
                    <strong>Tempo entre clientes (minutos)</strong>

                    <div style={{ marginTop: "5px" }}>
                        <input
                            type="number"
                            min="0"
                            max="60"
                            value={bufferMinutes}
                            onChange={(e) => setBufferMinutes(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className="button-primary"
                    style={{ marginTop: "10px" }}
                    onClick={saveBusinessHours}
                >
                    Salvar
                </button>

                <button
                    className="button-secondary"
                    onClick={onClose}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}