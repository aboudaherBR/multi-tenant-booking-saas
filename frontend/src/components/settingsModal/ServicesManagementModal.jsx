import { useState } from "react";

export default function ServicesManagementModal({
    isOpen,
    onClose,
    services,
    newService,
    setNewService,
    onCreate,
    onDelete
}) {

    console.log("ServicesManagementModal renderizou", {
        isOpen
    });

    const [selectedService, setSelectedService] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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
                        {selectedService
                            ? "Serviço"
                            : "Gerenciar serviços"}
                    </h3>

                    <button
                        className="button-icon"
                        onClick={() => {

                            setSelectedService(null);
                            setIsEditing(false);

                            onClose();
                        }}
                    >
                        ✕
                    </button>

                </div>

                {selectedService ? (

                    <div>

                        <button
                            className="button-icon"
                            style={{
                                marginBottom: "16px"
                            }}
                            onClick={() => {
                                setSelectedService(null);
                                setIsEditing(false);
                            }}
                        >
                            ← Voltar
                        </button>

                        <div>

                            <strong>Nome:</strong>{" "}

                            {isEditing ? (
                                <input
                                    className="input"
                                    value={selectedService.name}
                                    onChange={(e) =>
                                        setSelectedService({
                                            ...selectedService,
                                            name: e.target.value
                                        })
                                    }
                                />
                            ) : (
                                selectedService.name
                            )}

                        </div>

                        <div style={{ marginTop: "12px" }}>

                            <strong>Duração:</strong>{" "}

                            {isEditing ? (
                                <input
                                    type="number"
                                    className="input"
                                    value={selectedService.duration_minutes}
                                    onChange={(e) =>
                                        setSelectedService({
                                            ...selectedService,
                                            duration_minutes: e.target.value
                                        })
                                    }
                                />
                            ) : (
                                `${selectedService.duration_minutes} min`
                            )}

                        </div>

                        <div style={{ marginTop: "12px" }}>

                            <strong>Preço:</strong>{" "}

                            {isEditing ? (
                                <input
                                    type="number"
                                    className="input"
                                    value={selectedService.base_price}
                                    onChange={(e) =>
                                        setSelectedService({
                                            ...selectedService,
                                            base_price: e.target.value
                                        })
                                    }
                                />
                            ) : (
                                `R$ ${Number(selectedService.base_price).toFixed(2)}`
                            )}

                        </div>

                        <button
                            className="button-secondary"
                            style={{
                                marginTop: "20px",
                                marginRight: "8px"
                            }}
                            onClick={() => setIsEditing(true)}
                        >
                            Editar serviço
                        </button>

                        <button
                            className="button-danger"
                            style={{
                                marginTop: "20px"
                            }}
                            onClick={() => onDelete(selectedService.id)}
                        >
                            Excluir serviço
                        </button>

                    </div>

                ) : (

                    <>

                        <p className="text-muted">
                            Aqui você poderá gerenciar os serviços.
                        </p>

                        <div style={{ marginTop: "20px" }}>

                            <input
                                type="text"
                                placeholder="Nome do serviço"
                                value={newService.name}
                                onChange={(e) =>
                                    setNewService({
                                        ...newService,
                                        name: e.target.value
                                    })
                                }
                                className="input"
                            />

                            <input
                                type="number"
                                placeholder="Duração (min)"
                                value={newService.duration_minutes}
                                onChange={(e) =>
                                    setNewService({
                                        ...newService,
                                        duration_minutes: e.target.value
                                    })
                                }
                                className="input"
                                style={{ marginTop: "10px" }}
                            />

                            <input
                                type="number"
                                placeholder="Preço"
                                value={newService.base_price}
                                onChange={(e) =>
                                    setNewService({
                                        ...newService,
                                        base_price: e.target.value
                                    })
                                }
                                className="input"
                                style={{ marginTop: "10px" }}
                            />

                            <button
                                className="button-primary"
                                style={{ marginTop: "10px" }}
                                onClick={onCreate}
                            >
                                Adicionar serviço
                            </button>

                        </div>

                        <div style={{ marginTop: "20px" }}>

                            <strong>
                                Serviços cadastrados
                            </strong>

                            {services?.length === 0 ? (

                                <p className="text-muted">
                                    Nenhum serviço cadastrado
                                </p>

                            ) : (

                                <div style={{ marginTop: "10px" }}>

                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            style={{
                                                padding: "12px",
                                                border: "1px solid var(--color-border)",
                                                borderRadius: "var(--radius)",
                                                marginBottom: "8px",
                                                cursor: "pointer",
                                            }}
                                        >

                                            <strong>
                                                {service.name}
                                            </strong>

                                            <div className="text-muted">
                                                {service.duration_minutes} min
                                            </div>

                                            <div>
                                                R$ {Number(service.base_price).toFixed(2)}
                                            </div>

                                        </div>
                                    ))}

                                </div>

                            )}

                        </div>

                    </>

                )}

            </div>

        </div>
    );
}