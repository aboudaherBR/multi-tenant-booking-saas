export default function ProfessionalsManagementModal({
    isOpen,
    onClose,
    professionals,
    newProfessional,
    setNewProfessional
}) {

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">

            <div
                className="modal-content modal-content--scrollable"
                style={{
                    maxHeight: "90vh"
                }}
            >

                <div className="modal-header">

                    <h3 className="heading">
                        Gerenciar profissionais
                    </h3>

                    <button
                        className="button-icon"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div style={{ marginTop: "20px" }}>

                    <input
                        type="text"
                        placeholder="Nome do profissional"
                        value={newProfessional.name}
                        onChange={(e) =>
                            setNewProfessional({
                                ...newProfessional,
                                name: e.target.value
                            })
                        }
                        className="input"
                    />

                    <input
                        type="text"
                        placeholder="Telefone"
                        value={newProfessional.phone}
                        onChange={(e) =>
                            setNewProfessional({
                                ...newProfessional,
                                phone: e.target.value
                            })
                        }
                        className="input"
                        style={{
                            marginTop: "10px"
                        }}
                    />

                    <button
                        className="button-primary"
                        style={{
                            marginTop: "10px"
                        }}
                    >
                        Adicionar profissional
                    </button>

                </div>

                <div style={{ marginTop: "20px" }}>

                    <strong>
                        Profissionais cadastrados
                    </strong>

                    <div style={{ marginTop: "10px" }}>

                        {professionals?.map((professional) => (
                            <div
                                key={professional.id}
                                style={{
                                    padding: "12px",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius)",
                                    marginBottom: "8px"
                                }}
                            >

                                <strong>
                                    {professional.name}
                                </strong>

                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}