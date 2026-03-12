import React, { useState, useEffect } from "react";

export default function ProfessionalServicesModal({
    professional,
    services,
    onClose
}) {

    if (!professional) return null;

    const [showAddService, setShowAddService] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [availableServices, setAvailableServices] = useState([]);
    const [customPrice, setCustomPrice] = useState("");
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [editingPrice, setEditingPrice] = useState("");

    async function loadAvailableServices() {

        try {

            const response = await fetch(
                "http://localhost:3000/services",
                { credentials: "include" }
            );

            const data = await response.json();

            setAvailableServices(data.services || []);

        } catch (err) {

            console.error("Erro ao carregar serviços", err);
            setAvailableServices([]);

        }

    }

    useEffect(() => {
        loadAvailableServices();
    }, []);

    async function saveProfessionalService() {

        if (!selectedServiceId) {
            alert("Selecione um serviço");
            return;
        }

        try {

            await fetch(
                `http://localhost:3000/admin/professionals/${professional.id}/services`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        serviceId: selectedServiceId,
                        customPrice: customPrice ? Number(customPrice) : null
                    })
                }
            );

            window.location.reload();

            alert("Serviço adicionado");

        } catch (err) {

            console.error("Erro ao adicionar serviço", err);

        }

    }

    async function removeService(serviceId) {

        const confirmDelete = confirm("Remover este serviço do profissional?");

        if (!confirmDelete) return;

        try {

            await fetch(
                `http://localhost:3000/admin/professionals/${professional.id}/services/${serviceId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            window.location.reload();

        } catch (err) {

            console.error("Erro ao remover serviço", err);

        }

    }

    async function updateServicePrice(serviceId) {

        try {

            await fetch(
                `http://localhost:3000/admin/professionals/${professional.id}/services`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        serviceId: serviceId,
                        customPrice: Number(editingPrice)
                    })
                }
            );

            window.location.reload();

        } catch (err) {

            console.error("Erro ao atualizar preço", err);

        }

    }

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>

            <div style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "8px",
                width: "420px"
            }}>

                <h2>
                    Serviços de {professional.name}
                </h2>

                <button
                    onClick={onClose}
                    style={{
                        marginBottom: "10px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#1890ff"
                    }}
                >
                    ← Voltar aos profissionais
                </button>

                <button
                    style={{ marginBottom: "16px" }}
                    onClick={() => setShowAddService(true)}
                >
                    + Adicionar serviço
                </button>

                {showAddService && (

                    <div style={{ marginBottom: "16px" }}>

                        <select
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                        >

                            <option value="">Selecione um serviço</option>

                            {availableServices.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}

                        </select>

                        <input
                            type="number"
                            step="0.01"
                            placeholder="Preço opcional"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            style={{ marginLeft: "8px", width: "120px" }}
                        />

                        <button
                            style={{ marginLeft: "8px" }}
                            onClick={saveProfessionalService}
                        >
                            Salvar
                        </button>

                    </div>

                )}

                {services.length === 0 && (
                    <p>Nenhum serviço vinculado.</p>
                )}

                {services.map(service => (

                    <div
                        key={service.id}
                        style={{
                            marginBottom: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >

                        <span>
                            {service.name} — R$ {service.price}
                        </span>

                        {editingServiceId === service.id ? (

                            <>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingPrice}
                                    onChange={(e) => setEditingPrice(e.target.value)}
                                    style={{ width: "80px", marginRight: "8px" }}
                                />

                                <button
                                    onClick={() => updateServicePrice(service.id)}
                                >
                                    Salvar
                                </button>

                            </>

                        ) : (

                            <>
                                <button
                                    style={{ marginRight: "6px" }}
                                    onClick={() => {
                                        setEditingServiceId(service.id);
                                        setEditingPrice(service.price);
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    style={{
                                        background: "#ff4d4f",
                                        color: "white",
                                        border: "none",
                                        padding: "4px 8px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => removeService(service.id)}
                                >
                                    Remover
                                </button>

                            </>

                        )}

                    </div>

                ))}

            </div>

        </div>
    );
}