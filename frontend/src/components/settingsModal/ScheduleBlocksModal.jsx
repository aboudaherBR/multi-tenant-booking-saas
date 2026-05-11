export default function ScheduleBlocksModal({
    isOpen,
    onClose,
    scheduleBlocks,
    onCreate
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content modal-content--scrollable">

                {/* HEADER */}
                <div className="modal-header">
                    <h3 className="heading">Bloqueios de agenda</h3>

                    <button
                        className="button-icon"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* DESCRIÇÃO */}
                <p className="text-muted">
                    Aqui você poderá gerenciar bloqueios de agenda.
                </p>
                <button
                    className="button-primary"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                        onClose();

                        setTimeout(() => {
                            onCreate();
                        }, 0);
                    }}
                >
                    Novo bloqueio
                </button>

                {/* LISTA */}
                <div style={{ marginTop: "15px" }}>
                    <strong>Bloqueios cadastrados</strong>

                    {scheduleBlocks?.length === 0 ? (
                        <p className="text-muted">
                            Nenhum bloqueio cadastrado
                        </p>
                    ) : (
                        <div style={{ marginTop: "10px" }}>
                            {scheduleBlocks.map((block, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--radius)",
                                        marginBottom: "8px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => console.log(block)}
                                >
                                    <div>
                                        <strong>
                                            {block.start_time} até {block.end_time}
                                        </strong>
                                    </div>

                                    <div className="text-muted">
                                        {block.reason || "Sem descrição"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}