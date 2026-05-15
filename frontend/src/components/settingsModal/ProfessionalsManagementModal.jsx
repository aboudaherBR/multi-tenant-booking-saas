import apiClient from "../../api/apiClient";
import { useState, useEffect } from "react";

export default function ProfessionalsManagementModal({
    isOpen,
    onClose,
    professionals,
    newProfessional,
    setNewProfessional,
    onCreate,
    selectedProfessional,
    setSelectedProfessional,
    onOpenProfessionalServices
}) {
    const [availableServices, setAvailableServices] =
        useState([]);

    const [selectedServiceId, setSelectedServiceId] =
        useState("");

    const [customPrice, setCustomPrice] =
        useState("");


    async function loadAvailableServices() {

        try {
            const data = await apiClient("/services");
            setAvailableServices(data.services || []);

        } catch (error) {
            console.error(
                "Erro ao carregar serviços",
                error
            );
            setAvailableServices([]);
        }
    }

    async function addServiceToProfessional() {

        if (!selectedServiceId) {
            return;
        }

        try {

            await apiClient(
                `/admin/professionals/${selectedProfessional.id}/services`,
                {
                    method: "POST",
                    body: {
                        serviceId: selectedServiceId,
                        customPrice:
                            customPrice
                                ? Number(customPrice)
                                : null
                    }
                }
            );

            const data = await apiClient(
                `/admin/professionals/${selectedProfessional.id}/services`
            );

            setSelectedProfessional({
                ...selectedProfessional,
                services: data
            });

            setSelectedServiceId("");
            setCustomPrice("");

        } catch (error) {

            console.error(
                "Erro ao adicionar serviço",
                error
            );
        }
    }

    useEffect(() => {
        loadAvailableServices();
    }, []);

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
                        onClick={onCreate}
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
                                onClick={async () => {

                                    try {

                                        const data = await apiClient(
                                            `/admin/professionals/${professional.id}/services`
                                        );

                                        setSelectedProfessional({
                                            ...professional,
                                            services: data
                                        });

                                    } catch (error) {

                                        console.error(
                                            "Erro ao carregar serviços do profissional",
                                            error
                                        );
                                    }
                                }} style={{
                                    padding: "12px",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius)",
                                    marginBottom: "8px",
                                    cursor: "pointer"
                                }}
                            >

                                <strong>
                                    {professional.name}
                                </strong>

                            </div>
                        ))}

                        {selectedProfessional && (

                            <div
                                style={{
                                    position: "fixed",
                                    inset: 0,
                                    background: "rgba(0, 0, 0, 0.5)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 9999
                                }}
                            >

                                <div
                                    className="modal-content modal-content--scrollable"
                                    style={{
                                        width: "90%",
                                        maxWidth: "400px"
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >

                                        <h3 className="heading">
                                            Profissional
                                        </h3>

                                        <button
                                            className="button-icon"
                                            onClick={() => setSelectedProfessional(null)}
                                        >
                                            ✕
                                        </button>

                                    </div>

                                    <div style={{ marginTop: "20px" }}>

                                        <div>
                                            <strong>Nome:</strong>{" "}
                                            {selectedProfessional.name}
                                        </div>

                                        <div style={{ marginTop: "10px" }}>
                                            <strong>Telefone:</strong>{" "}
                                            {selectedProfessional.phone || "Não informado"}
                                        </div>
                                        <div style={{ marginTop: "20px" }}>

                                            <strong>
                                                Serviços do profissional
                                            </strong>

                                            <div style={{ marginTop: "10px" }}>

                                                {selectedProfessional.services?.length === 0 ? (

                                                    <div className="text-muted">
                                                        Nenhum serviço vinculado
                                                    </div>

                                                ) : (

                                                    selectedProfessional.services?.map((service) => (

                                                        <div
                                                            key={service.id}
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid var(--color-border)",
                                                                borderRadius: "var(--radius)",
                                                                marginBottom: "8px"
                                                            }}
                                                        >

                                                            <div>
                                                                <strong>
                                                                    {service.name}
                                                                </strong>
                                                            </div>

                                                            <div className="text-muted">
                                                                {service.duration_minutes} min
                                                            </div>

                                                            <div>
                                                                R$ {Number(service.price).toFixed(2)}
                                                            </div>

                                                        </div>
                                                    ))
                                                )}

                                                <div style={{ marginTop: "20px" }}>

                                                    <strong>
                                                        Adicionar serviço
                                                    </strong>

                                                    <div style={{ marginTop: "10px" }}>

                                                        <select
                                                            className="input"
                                                            value={selectedServiceId}
                                                            onChange={(e) =>
                                                                setSelectedServiceId(e.target.value)
                                                            }
                                                        >

                                                            <option value="">
                                                                Selecione um serviço
                                                            </option>

                                                            {availableServices.map((service) => (

                                                                <option
                                                                    key={service.id}
                                                                    value={service.id}
                                                                >
                                                                    {service.name}
                                                                </option>

                                                            ))}

                                                        </select>

                                                        <input
                                                            type="number"
                                                            placeholder="Preço personalizado (opcional)"
                                                            value={customPrice}
                                                            onChange={(e) =>
                                                                setCustomPrice(e.target.value)
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
                                                            onClick={addServiceToProfessional}
                                                        >
                                                            Adicionar serviço
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>


                                    </div>

                                </div>

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}