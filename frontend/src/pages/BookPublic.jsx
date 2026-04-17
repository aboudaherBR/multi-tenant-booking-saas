import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfessionalsModal from "../components/ProfessionalsModal";
import ServicesModal from "../components/ServicesModal";
import AvailabilityModal from "../components/AvailabilityModal";
import ConfirmBookingModal from "../components/ConfirmBookingModal";
import apiClient from "../api/apiClient";
import PhoneErrorModal from "../components/PhoneErrorModal";
import NameErrorModal from "../components/NameErrorModal";
import { formatPhone } from "../utils/phone.utils";
import { formatDateBR } from "../utils/date.utils";

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
    const [showPhoneConfirmModal, setShowPhoneConfirmModal] = useState(false);

    const isDisabled = !phone || !!phoneError;

    const [stage, setStage] = useState("welcome"); //Animation 

    useEffect(() => {
        async function fetchProfessionals() {
            try {
                const data = await apiClient(
                    `/public/${slug}/professionals?withPreview=true`
                );
                setProfessionals(data);
                console.log("PROFISSIONAIS:", data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchProfessionals();
    }, [slug]);

    useEffect(() => {
        const t1 = setTimeout(() => setStage("transition"), 1200);
        const t2 = setTimeout(() => setStage("content"), 1500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    useEffect(() => {
        if (!phone) return;

        const digitsOnly = phone.replace(/\D/g, "");
        const normalized = normalizePhone(digitsOnly);

        if (!normalized || normalized.length < 13) return;

        const timeout = setTimeout(async () => {
            try {
                setIsCheckingClient(true);

                const res = await apiClient(
                    `/clients/by-phone/${slug}?phone=${encodeURIComponent(normalized)}`
                );

                if (res && res.name) {
                    setClientName(res.name);
                    setExistingClient(true);
                    setClientFound(true);
                } else {
                    setClientName("");
                    setExistingClient(false);
                    setClientFound(false);
                }

            } catch (err) {
                console.error("Erro ao buscar cliente:", err);

                setClientName("");
                setExistingClient(false);
                setClientFound(false);
            } finally {
                setIsCheckingClient(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [phone]);

    function handleStart() {
        const digitsOnly = phone.replace(/\D/g, "");
        const normalized = normalizePhone(digitsOnly);

        if (!normalized) {
            setShowPhoneErrorModal(true);
            return;
        }

        if (!clientName.trim()) {
            setShowNameErrorModal(true);
            return;
        }

        if (!existingClient) {
            setShowPhoneConfirmModal(true);
            return;
        }

        setShowProfessionalsModal(true);
    }

    async function handleConfirmBooking() {
        try {
            console.log("📞 PHONE ORIGINAL:", phone);

            const digitsOnly = phone.replace(/\D/g, "");
            const normalizedPhone = normalizePhone(digitsOnly);
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
            <div className="header-gradient">
                <div className="mb-10">
                    <div className="avatar-placeholder" />
                </div>

                <h2 className="heading" style={{ color: "white" }}>Barbearia</h2>
            </div>

            {/* ⚪ CARD */}
            <div
                className="card container-main"
                style={{
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* WELCOME */}
                {stage !== "content" && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff",
                            zIndex: 2,
                            transform:
                                stage === "welcome"
                                    ? "translateX(0)"
                                    : "translateX(-100%)",
                            opacity: stage === "welcome" ? 1 : 0,
                            transition: "all 0.4s ease"
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: "600",
                                color: "#0f172a"
                            }}
                        >
                            Bem-vindo à AGENDARE
                        </h2>
                    </div>
                )}

                {/* CONTEÚDO PRINCIPAL */}
                <div
                    style={{
                        transform:
                            stage === "content"
                                ? "translateX(0)"
                                : "translateX(100%)",
                        opacity: stage === "content" ? 1 : 0,
                        transition: "all 0.4s ease"
                    }}
                >
                    {bookingSuccess ? (
                        <div className="text-center">
                            <h2 className="heading text-success">
                                ✔ Agendamento confirmado!
                            </h2>

                            <p className="text-row">
                                <strong>Serviço:</strong> {selectedService?.name}
                            </p>
                            <p className="text-row">
                                <strong>Profissional:</strong> {selectedProfessional?.name}
                            </p>
                            <p className="text-row">
                                <strong>Data:</strong>{" "}
                                {formatDateBR(selectedSlot?.date, selectedSlot?.startTime)}
                            </p>
                            <p className="text-row">
                                <strong>Valor:</strong>{" "}
                                R${" "}
                                {Number(selectedService?.price).toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2
                                })}
                            </p>

                            <p className="mt-20">
                                Obrigado, {clientName}!
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="heading">
                                Agende seu horário
                            </h2>

                            <p className="subtext">
                                Leva menos de 1 minuto
                            </p>

                            <input
                                className={`input-field mb-10 ${phoneError ? "input-error" : ""}`}
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Telefone"
                                value={phone}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    const formatted = formatPhone(raw);
                                    setPhone(formatted);

                                    const digitsOnly = formatted.replace(/\D/g, "");
                                    const normalized = normalizePhone(digitsOnly);

                                    if (!formatted) {
                                        setPhoneError("");
                                    } else if (!normalized) {
                                        setPhoneError("Digite um telefone válido com DDD");
                                    } else {
                                        setPhoneError("");
                                    }
                                }}
                            />

                            {phoneError && (
                                <p className="text-error">{phoneError}</p>
                            )}

                            {isCheckingClient ? (
                                <p className="subtext">
                                    Verificando{" "}
                                    <span className="loading-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>
                                </p>
                            ) : clientFound ? (
                                <div className="mb-20">
                                    <p className="text-row">
                                        Olá, <strong>{clientName}</strong>
                                    </p>

                                    <button
                                        className="button-link"
                                        onClick={() => {
                                            setPhone("");
                                            setClientName("");
                                            setClientFound(false);
                                            setExistingClient(false);
                                        }}
                                    >
                                        Não é você? Trocar número
                                    </button>
                                </div>
                            ) : phone ? (
                                <div className="mb-20">
                                    <p className="text-row">
                                        Primeira vez aqui? Digite seu nome completo para começar
                                    </p>

                                    <input
                                        className="input-field"
                                        type="text"
                                        placeholder="Digite seu nome"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        disabled={existingClient}
                                    />

                                    {existingClient && (
                                        <p className="text-success mt-5">
                                            Bem-vindo de volta, {clientName}
                                        </p>
                                    )}
                                </div>
                            ) : null}

                            <button
                                className="button-primary"
                                onClick={handleStart}
                                disabled={isDisabled}
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

                            {showPhoneConfirmModal && (
                                <div className="modal-backdrop">
                                    <div className="modal-content">
                                        <h3>Confirmar telefone</h3>

                                        <p className="mb-20">
                                            Esse é o seu número?
                                        </p>

                                        <strong>{phone}</strong>

                                        <div style={{ marginTop: "20px" }}>
                                            <button
                                                className="button-secondary"
                                                onClick={() => {
                                                    setShowPhoneConfirmModal(false);
                                                }}
                                            >
                                                Corrigir
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setShowPhoneConfirmModal(false);
                                                    setShowProfessionalsModal(true);
                                                }}
                                                style={{
                                                    padding: "10px",
                                                    borderRadius: "6px",
                                                    border: "none",
                                                    background: "#0f172a",
                                                    color: "#fff"
                                                }}
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}