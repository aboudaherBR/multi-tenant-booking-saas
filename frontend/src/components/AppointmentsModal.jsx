export default function AppointmentsModal({ appointments, onClose }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">

                <h3>Meus agendamentos</h3>

                <p>Modal funcionando</p>

                <button
                    className="button-secondary"
                    onClick={onClose}
                >
                    Fechar
                </button>

            </div>
        </div>
    );
}