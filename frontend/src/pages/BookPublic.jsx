import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfessionalsModal from "../components/ProfessionalsModal";
import ServicesModal from "../components/ServicesModal";
import AvailabilityModal from "../components/AvailabilityModal";
import ConfirmBookingModal from "../components/ConfirmBookingModal";
import apiClient from "../api/apiClient";
import PhoneErrorModal from "../components/PhoneErrorModal";
import NameErrorModal from "../components/NameErrorModal";

// 🔥 FUNÇÃO UTILITÁRIA (TOPO - PADRÃO CORRETO)
function normalizePhone(value) {
    const numbers = value.replace(/\D/g, "");
    const trimmed = numbers.slice(0, 11);

    if (trimmed.length === 11) {
        return `+55${trimmed}`;
    }

    return null;
}

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

    const [phoneError, setPhoneError] = useState("");
    const [showPhoneErrorModal, setShowPhoneErrorModal] = useState(false);

    const [showNameErrorModal, setShowNameErrorModal] = useState(false);
    const [isCheckingClient, setIsCheckingClient] = useState(false);
    const [clientFound, setClientFound] = useState(false);

    const [existingClient, setExistingClient] = useState(false);

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
        const normalized = normalizePhone(phone);

        if (!normalized) {
            setShowPhoneErrorModal(true);
            return;
        }

        if (!clientName.trim()) {
            setShowNameErrorModal(true);
            return;
        }

        setShowProfessionalsModal(true);
    }

    useEffect(() => {
        if (!phone) return;

        const normalized = normalizePhone(phone);

        console.log("PHONE DIGITADO:", phone);
        console.log("PHONE NORMALIZED:", normalized);

        if (!normalized || normalized.length < 13) return;

        const timeout = setTimeout(async () => {
            try {
                setIsCheckingClient(true);

                const res = await apiClient(
                    `/clients/by-phone/${slug}?phone=${encodeURIComponent(normalized)}`
                );

                console.log("RES COMPLETO:", res);

                // ✅ CORREÇÃO PRINCIPAL
                if (res && res.name) {
                    console.log("ENTROU NO IF CORRETO");
                    console.log("NAME:", res.name);

                    setClientName(res.name);
                    setExistingClient(true);
                    setClientFound(true);
                } else {
                    console.log("NÃO ENTROU NO IF");

                    setClientName('');
                    setExistingClient(false);
                    setClientFound(false);
                }

            } catch (err) {
                console.error("Erro ao buscar cliente:", err);

                setClientName('');
                setExistingClient(false);
                setClientFound(false);
            } finally {
                setIsCheckingClient(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [phone]);

    async function handleConfirmBooking() {
        try {
            console.log("📞 PHONE ORIGINAL:", phone);

            const normalizedPhone = normalizePhone(phone);
            console.log("📞 NORMALIZED:", normalizedPhone);

            if (!normalizedPhone) {
                alert("Telefone inválido. Digite um número válido com DDD.");
                return;
            }

            const payload = {
                companySlug: slug,
                professionalSlug: selectedProfessional.slug,
                serviceSlug: selectedService.slug,
                date: selectedSlot.date,
                startTime: selectedSlot.startTime,
                clientName,
                phone: normalizedPhone
            };

            console.log("📦 PAYLOAD:", payload);

            await apiClient("/agendar", {
                method: "POST",
                body: payload
            });

            setShowConfirmModal(false);
            setBookingSuccess(true);

        } catch (err) {
            console.error("Erro ao criar agendamento:", err);
            alert("Erro ao agendar");
        }

        console.log("RENDER:", { clientFound, existingClient, clientName });
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>

            {/* 🔵 HEADER */}
            <div
                style={{
                    background: "linear-gradient(135deg, #0f172a, #1e293b)",
                    padding: "30px 20px",
                    textAlign: "center",
                    color: "#fff"
                }}
            >
                <div style={{ marginBottom: "10px" }}>
                    <div
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "#fff",
                            margin: "0 auto"
                        }}
                    />
                </div>

                <h2 style={{ margin: 0 }}>Barbearia</h2>
            </div>

            {/* ⚪ CARD */}
            <div
                style={{
                    maxWidth: "400px",
                    margin: "-30px auto 0 auto",
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}
            >

                {bookingSuccess ? (
                    <div style={{ textAlign: "center" }}>
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
                        <h2 style={{ marginBottom: "5px" }}>
                            Agende seu horário
                        </h2>

                        <p style={{ marginBottom: "20px", color: "#666" }}>
                            Leva menos de 1 minuto
                        </p>

                        <input
                            type="text"
                            placeholder="Telefone"
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPhone(value);

                                const normalized = normalizePhone(value);

                                if (!value) {
                                    setPhoneError("");
                                } else if (!normalized) {
                                    setPhoneError("Digite um telefone válido com DDD");
                                } else {
                                    setPhoneError("");
                                }
                            }}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ddd"
                            }}
                        />
                        {phoneError && (
                            <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
                                {phoneError}
                            </p>
                        )}

                        {/* 🔥 ESTADO DINÂMICO DO CLIENTE */}

                        {isCheckingClient ? (
                            <p style={{ marginBottom: "20px", color: "#666" }}>
                                Verificando...
                            </p>
                        ) : clientFound ? (
                            <div style={{ marginBottom: "20px" }}>
                                <p>
                                    👋 Olá, <strong>{clientName}</strong>
                                </p>

                                <button
                                    onClick={() => {
                                        setPhone("");
                                        setClientName("");
                                        setClientFound(false);
                                    }}
                                    style={{
                                        marginTop: "5px",
                                        fontSize: "14px",
                                        background: "none",
                                        border: "none",
                                        color: "#2563eb",
                                        cursor: "pointer"
                                    }}
                                >
                                    Não é você? Trocar número
                                </button>
                            </div>
                        ) : phone ? (
                            <div style={{ marginBottom: "20px" }}>
                                <p style={{ marginBottom: "8px" }}>
                                    Primeira vez aqui?
                                </p>

                                <input
                                    type="text"
                                    placeholder="Digite seu nome"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    disabled={existingClient}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        backgroundColor: existingClient ? "#f5f5f5" : "white"
                                    }}
                                />
                                {existingClient && (
                                    <p style={{ color: "green", marginTop: "8px" }}>
                                        Bem-vindo de volta, {clientName} 👋
                                    </p>
                                )}
                            </div>
                        ) : null}

                        <button
                            onClick={handleStart}
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#0f172a",
                                color: "#fff",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Continuar agendamento
                        </button>

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
                                onConfirm={handleConfirmBooking}
                            />
                        )}
                        {showPhoneErrorModal && (
                            <PhoneErrorModal
                                onClose={() => setShowPhoneErrorModal(false)}
                            />
                        )}

                        {showNameErrorModal && (
                            <NameErrorModal
                                onClose={() => setShowNameErrorModal(false)}
                            />
                        )}

                    </>
                )}
            </div>
        </div>
    );
}