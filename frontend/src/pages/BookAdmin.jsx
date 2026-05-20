import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfessionalsModal from "../components/ProfessionalsModal";
import ServicesModal from "../components/ServicesModal";
import AvailabilityModal from "../components/AvailabilityModal";
import ConfirmBookingModal from "../components/ConfirmBookingModal";

import apiClient from "../api/apiClient";

export default function BookAdmin() {

    const { slug } = useParams();

    // CLIENT
    const [selectedClient, setSelectedClient] =
        useState(null);

    const [showClientModal, setShowClientModal] =
        useState(false);

    // PROFESSIONALS
    const [professionals, setProfessionals] = useState([]);

    const [selectedProfessional, setSelectedProfessional] =
        useState(null);

    // SERVICES
    const [selectedService, setSelectedService] =
        useState(null);

    // SLOT
    const [selectedSlot, setSelectedSlot] =
        useState(null);

    // MODALS
    const [showProfessionalsModal, setShowProfessionalsModal] =
        useState(false);

    const [showServicesModal, setShowServicesModal] =
        useState(false);

    const [showAvailabilityModal, setShowAvailabilityModal] =
        useState(false);

    const [showConfirmModal, setShowConfirmModal] =
        useState(false);

    // LOAD PROFESSIONALS
    useEffect(() => {

        async function fetchProfessionals() {

            try {

                const data = await apiClient(
                    `/public/${slug}/professionals?withPreview=true`
                );

                setProfessionals(data);

            } catch (err) {

                console.error(err);
            }
        }

        fetchProfessionals();

    }, [slug]);

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5"
            }}
        >

            {/* HEADER */}
            <div className="header-gradient">

                <h2
                    className="heading"
                    style={{ color: "white" }}
                >
                    Agendamento Admin
                </h2>

            </div>

            {/* CARD */}
            <div className="card container-main">

                <h2 className="heading">
                    Novo agendamento
                </h2>

                <p className="subtext">
                    Fluxo administrativo
                </p>

                {/* CLIENT */}
                <div style={{ marginBottom: "20px" }}>

                    {selectedClient ? (

                        <div>

                            <p className="text-row">
                                <strong>Cliente:</strong>{" "}
                                {selectedClient.name}
                            </p>

                            <button
                                className="button-soft"
                                style={{
                                    width: "auto",
                                    padding: "8px 14px",
                                    marginTop: "10px"
                                }}
                                onClick={() =>
                                    setShowClientModal(true)
                                }
                            >
                                Trocar cliente
                            </button>

                        </div>

                    ) : (

                        <button
                            className="button-primary"
                            onClick={() =>
                                setShowClientModal(true)
                            }
                        >
                            Selecionar cliente
                        </button>

                    )}

                </div>

                {/* ACTION */}
                <button
                    className="button-primary"
                    disabled={!selectedClient}
                    onClick={() =>
                        setShowProfessionalsModal(true)
                    }
                >
                    Iniciar agendamento
                </button>

            </div>

            {/* PROFESSIONALS */}
            {showProfessionalsModal && (

                <ProfessionalsModal
                    professionals={professionals}
                    onClose={() =>
                        setShowProfessionalsModal(false)
                    }
                    onSelect={(professional) => {

                        setSelectedProfessional(professional);

                        setShowProfessionalsModal(false);

                        setShowServicesModal(true);
                    }}
                />
            )}

            {/* SERVICES */}
            {showServicesModal &&
                selectedProfessional && (

                    <ServicesModal
                        slug={slug}
                        professional={selectedProfessional}
                        onBack={() => {

                            setShowServicesModal(false);

                            setShowProfessionalsModal(true);
                        }}
                        onClose={() =>
                            setShowServicesModal(false)
                        }
                        onSelect={(service) => {

                            setSelectedService(service);

                            setShowServicesModal(false);

                            setShowAvailabilityModal(true);
                        }}
                    />
                )}

            {/* AVAILABILITY */}
            {showAvailabilityModal &&
                selectedProfessional &&
                selectedService && (

                    <AvailabilityModal
                        slug={slug}
                        professional={selectedProfessional}
                        service={selectedService}
                        onBack={() => {

                            setShowAvailabilityModal(false);

                            setShowServicesModal(true);
                        }}
                        onClose={() =>
                            setShowAvailabilityModal(false)
                        }
                        onSelect={(slot) => {

                            setSelectedSlot(slot);

                            setShowAvailabilityModal(false);

                            setShowConfirmModal(true);
                        }}
                    />
                )}

            {/* CONFIRM */}
            {showConfirmModal &&
                selectedSlot && (

                    <ConfirmBookingModal
                        professional={selectedProfessional}
                        service={selectedService}
                        slot={selectedSlot}
                        onBack={() => {

                            setShowConfirmModal(false);

                            setShowAvailabilityModal(true);
                        }}
                        onClose={() =>
                            setShowConfirmModal(false)
                        }
                        onConfirm={() => {

                            console.log("CONFIRMAR");

                        }}
                    />
                )}

        </div>
    );
}