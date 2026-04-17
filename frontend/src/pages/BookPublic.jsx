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
        const t1 = setTimeout(() => setStage("transition"), 300);
        const t2 = setTimeout(() => setStage("content"), 650);

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
                            Bem-vindo 👋
                        </h2>
                    </div>
                )}

                {/* CONTEÚDO PRINCIPAL (AGORA ANIMADO) */}
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
                            {/* 🔥 SEU CONTEÚDO ORIGINAL INTACTO */}
                            <h2 className="heading">
                                Agende seu horário
                            </h2>

                            <p className="subtext">
                                Leva menos de 1 minuto
                            </p>

                            {/* resto continua igual */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}