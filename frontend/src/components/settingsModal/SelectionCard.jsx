export default function SelectionCard({
    title,
    description,
    selected,
    onClick
}) {
    return (
        <div
            className={`selection-card ${selected ? "selection-card--active" : ""}`}
            onClick={onClick}
        >
            <h4>{title}</h4>

            <p>{description}</p>
        </div>
    );
}