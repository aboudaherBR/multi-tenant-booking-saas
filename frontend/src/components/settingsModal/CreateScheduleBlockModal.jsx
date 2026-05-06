import SelectionCard from "./SelectionCard";

export default function CreateScheduleBlockModal() {
    return (
        <div className="modal-content">
            <SelectionCard
                title="Todos os profissionais"
                description="Bloqueia horários para toda a agenda"
                selected={true}
                onClick={() => console.log("clicou")}
            />
        </div>
    );
}