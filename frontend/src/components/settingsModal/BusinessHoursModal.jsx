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
      <div className="modal-content modal-content--scrollable">

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
          <div
            key={day.weekday}
            onClick={() => {
              const updated = businessHours.map(d =>
                d.weekday === day.weekday
                  ? { ...d, is_active: !d.is_active }
                  : d
              );
              setBusinessHours(updated);
            }}
            style={{
              marginBottom: "12px",
              padding: "10px",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              cursor: "pointer"
            }}
          >
            {/* HEADER DO DIA */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={day.is_active}
                readOnly
              />

              <strong>{weekdayNames[day.weekday]}</strong>
            </div>

            {/* HORÁRIOS */}
            <div
              style={{ display: "flex", gap: "8px", marginTop: "8px" }}
              onClick={(e) => e.stopPropagation()} // 🔥 evita conflito com clique do card
            >
              <input
                type="time"
                className="input-field"
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
                className="input-field"
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

        {/* ALMOÇO */}
        <div style={{ marginTop: "15px" }}>
          <strong>Horário de almoço</strong>

          <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
            <input
              type="time"
              className="input-field"
              value={lunchStart}
              onChange={(e) => setLunchStart(e.target.value)}
            />

            <span>até</span>

            <input
              type="time"
              className="input-field"
              value={lunchEnd}
              onChange={(e) => setLunchEnd(e.target.value)}
            />

            <button
              className="button-secondary"
              onClick={() => {
                setLunchStart("");
                setLunchEnd("");
              }}
            >
              Remover
            </button>
          </div>
        </div>

        {/* BUFFER */}
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

        {/* AÇÕES */}
        <button
          className="button-primary"
          style={{ marginTop: "12px" }}
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