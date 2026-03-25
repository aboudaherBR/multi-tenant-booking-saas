import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfessionalsModal from "../components/ProfessionalsModal";
import ServicesModal from "../components/ServicesModal";
import AvailabilityModal from "../components/AvailabilityModal";
import ConfirmBookingModal from "../components/ConfirmBookingModal";
import apiClient from "../api/apiClient";

export default function BookPublic() {
    const { slug } = useParams();

    const [phone, setPhone] = useState("");
    const [clientName, setClientName] = useState("");

    const [showProfessionalsModal, setShowProfessionalsModal] = useState(false);
    const [showServicesModal, setShowServicesModal] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

    const [professionals, setProfessionals] = useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        async function fetchProfessionals() {
            try {
                const data = await apiClient(`/agendar/${slug}/profissionais`);
                setProfessionals(data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchProfessionals();
    }, [slug]);

    function handleStart() {
        if (!phone) return;
        setShowProfessionalsModal(true);
    }

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>

            {/* 🔥 TELA DE SUCESSO */}
            {bookingSuccess ? (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <h2>Agendamento confirmado!</h2>

                    <p><strong>Serviço:</strong> {selectedService?.name}</p>
                    <p><strong>Profissional:</strong> {selectedProfessional?.name}</p>
                    <p><strong>Data:</strong> {selectedSlot?.date}</p>
                    <p><strong>Horário:</strong> {selectedSlot?.startTime}</p>

                    <p style={{ marginTop: "20px" }}>
                        Obrigado, {clientName}!
                    </p>
                </div>
            ) : (
                <>
                    <h2>Agende seu horário</h2>

                    <input
                        type="text"
                        placeholder="Telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    />

                    <input
                        type="text"
                        placeholder="Nome"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
                    />

                    <button
                        onClick={handleStart}
                        style={{ width: "100%", padding: "12px", cursor: "pointer" }}
                    >
                        Procurar profissional
                    </button>

                    {/* PROFISSIONAIS */}
                    {showProfessionalsModal && (
                        <ProfessionalsModal
                            professionals={professionals}
                            onClose={() => setShowProfessionalsModal(false)}
                            onSelect={(professional) => {
                                setSelectedProfessional(professional);
                                setShowProfessionalsModal(false);
                                setShowServicesModal(true);
                            }}
                        />
                    )}

                    {/* SERVIÇOS */}
                    {showServicesModal && selectedProfessional && (
                        <ServicesModal
                            slug={slug}
                            professional={selectedProfessional}
                            onBack={() => {
                                setShowServicesModal(false);
                                setShowProfessionalsModal(true);
                            }}
                            onClose={() => setShowServicesModal(false)}
                            onSelect={(service) => {
                                setSelectedService(service);
                                setShowServicesModal(false);
                                setShowAvailabilityModal(true);
                            }}
                        />
                    )}

                    {/* HORÁRIOS */}
                    {showAvailabilityModal && selectedProfessional && selectedService && (
                        <AvailabilityModal
                            slug={slug}
                            professional={selectedProfessional}
                            service={selectedService}
                            onBack={() => {
                                setShowAvailabilityModal(false);
                                setShowServicesModal(true);
                            }}
                            onClose={() => setShowAvailabilityModal(false)}
                            onSelect={(slot) => {
                                setSelectedSlot(slot);
                                setShowAvailabilityModal(false);
                                setShowConfirmModal(true);
                            }}
                        />
                    )}

                    {/* CONFIRMAÇÃO */}
                    {showConfirmModal && selectedSlot && (
                        <ConfirmBookingModal
                            professional={selectedProfessional}
                            service={selectedService}
                            slot={selectedSlot}
                            onBack={() => {
                                setShowConfirmModal(false);
                                setShowAvailabilityModal(true);
                            }}
                            onClose={() => setShowConfirmModal(false)}
                            onConfirm={() => {
                                setShowConfirmModal(false);
                                setBookingSuccess(true);
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
}