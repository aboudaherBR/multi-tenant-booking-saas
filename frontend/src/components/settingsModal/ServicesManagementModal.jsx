export default function ServicesManagementModal({
    isOpen,
    onClose
}) {

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">

                <div className="modal-header">
                    <h3 className="heading">
                        Gerenciar serviços
                    </h3>

                    <button
                        className="button-icon"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <p className="text-muted">
                    Aqui você poderá gerenciar os serviços.
                </p>

            </div>
        </div>
    );
}