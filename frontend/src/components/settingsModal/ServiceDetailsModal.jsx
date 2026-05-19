export default function ServiceDetailsModal({
    service,
    onClose,
    onDelete
}) {

    if (!service) return null;

    return (
        <div
            className="modal-backdrop"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                background: "transparent"
            }}
        >

            <div
                className="modal-content modal-content--scrollable"
                style={{
                    maxHeight: "90vh"
                }}
            >

                <div className="modal-header">

                    <h3 className="heading">
                        Serviço
                    </h3>

                    <button
                        className="button-icon"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div style={{ marginTop: "16px" }}>

                    <div>
                        <strong>Nome:</strong>{" "}
                        {service.name}
                    </div>

                    <div style={{ marginTop: "8px" }}>
                        <strong>Duração:</strong>{" "}
                        {service.duration_minutes} min
                    </div>

                    <div style={{ marginTop: "8px" }}>
                        <strong>Preço:</strong>{" "}
                        R$ {Number(service.base_price).toFixed(2)}
                    </div>

                    <button
                        className="button-danger"
                        style={{
                            marginTop: "20px"
                        }}
                        onClick={() => onDelete(service.id)}
                    >
                        Excluir serviço
                    </button>

                </div>
            </div>

        </div>
    );
}