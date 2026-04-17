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

    const [stage, setStage] = useState("welcome");

    useEffect(() => {
        async function fetchProfessionals() {
            try {
                const data = await apiClient(
                    `/public/${slug}/professionals?withPreview=true`
                );
                setProfessionals(data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchProfessionals();
    }, [slug]);

    useEffect(() => {
        const t1 = setTimeout(() => setStage("transition"), 1600);
        const t2 = setTimeout(() => setStage("content"), 1800);

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
            const payload = {
                companySlug: slug,
                professionalSlug: selectedProfessional.slug,
                serviceSlug: selectedService.slug,
                date: selectedSlot.date,
                startTime: selectedSlot.startTime,
                clientName,
                phone: normalizePhone(phone.replace(/\D/g, ""))
            };

            await apiClient("/agendar", {
                method: "POST",
                body: payload
            });

            setShowConfirmModal(false);
            setBookingSuccess(true);
        } catch (err) {
            alert("Erro ao agendar");
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            {/* HEADER */}
            <div className="header-gradient">
                <div className="mb-10">
                    <div className="avatar-placeholder" />
                </div>
                <h2 className="heading" style={{ color: "white" }}>
                    Barbearia
                </h2>
            </div>

            {/* CARD */}
            <div
                className="card container-main"
                style={{
                    position: "relative",
                    overflow: stage !== "content" ? "hidden" : "visible"
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
                            zIndex: 2
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "22px",
                                fontWeight: "900",
                                color: "#0f172a"
                            }}
                        >
                            Bem-vindo à Agendare
                        </h2>
                    </div>
                )}

                {/* CONTEÚDO */}
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
                    <h2 className="heading">Agende seu horário</h2>

                    <p className="subtext">Leva menos de 1 minuto</p>

                    <input
                        className={`input-field mb-10 ${phoneError ? "input-error" : ""}`}
                        placeholder="Telefone"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                    />

                    <button
                        className="button-primary"
                        onClick={handleStart}
                        disabled={isDisabled}
                    >
                        Continuar agendamento
                    </button>
                </div>
            </div>

            {/* 🔥 MODAL FORA DO CARD (CORREÇÃO PRINCIPAL) */}
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
        </div>
    );
}