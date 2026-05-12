export default function ScheduleBlocksModal({
    isOpen,
    onClose,
    scheduleBlocks,
    onCreate
}) {
    if (!isOpen) return null;

    function getBlockTypeLabel(block) {
        return block.mode === "recurring"
            ? "Recorrente"
            : "Pontual";
    }

    function getBlockTimeLabel(block) {

        if (block.time_scope === "full_day") {
            return "Dia inteiro";
        }

        if (block.start_time && block.end_time) {
            return `${block.start_time.slice(0, 5)} às ${block.end_time.slice(0, 5)}`;
        }

        return "Horário não definido";
    }

    function getWeekdaysLabel(block) {

        if (!block.recurring_days?.length) {
            return "";
        }

        const labels = {
            0: "Dom",
            1: "Seg",
            2: "Ter",
            3: "Qua",
            4: "Qui",
            5: "Sex",
            6: "Sáb"
        };

        return block.recurring_days
            .map((day) => labels[day])
            .join(", ");
    }

    function getBlockPrimaryLabel(block) {

        if (block.mode === "recurring") {
            return getWeekdaysLabel(block);
        }

        return new Date(block.start_date)
            .toLocaleDateString("pt-BR");
    }

    function getBlockScopeLabel(block) {

        if (block.professional_id) {
            return block.professional_name || "Profissional";
        }

        return "Todos os profissionais";
    }

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
                                    onClick={() =>
                                        console.log({
                                            mode: block.mode,
                                            weekdays: block.weekdays,
                                            recurring_days: block.recurring_days,
                                            time_scope: block.time_scope
                                        })
                                    }
                                    style={{
                                        padding: "10px",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--radius)",
                                        marginBottom: "8px",
                                        cursor: "pointer"
                                    }}

                                >
                                    <div style={{ fontWeight: "600" }}>

                                        {getBlockTypeLabel(block)}

                                        {" • "}

                                        {getBlockPrimaryLabel(block)}

                                    </div>

                                    <div
                                        style={{
                                            marginTop: "4px"
                                        }}
                                    >
                                        {getBlockTimeLabel(block)}
                                    </div>

                                    <div className="text-muted">
                                        {getBlockScopeLabel(block)}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: "4px"
                                        }}
                                    >
                                        {getBlockTimeLabel(block)}
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