import SelectionCard from "./SelectionCard";

export default function CreateScheduleBlockModal({
    isOpen,
    onClose
}) {

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
                    selected={true}
                    onClick={() => console.log("clicou")}
                />

            </div>
        </div>
    );
}