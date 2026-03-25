import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfessionalsModal from "../components/ProfessionalsModal";
import ServicesModal from "../components/ServicesModal";
import AvailabilityModal from "../components/AvailabilityModal";
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
                        console.log("SERVICE SELECIONADO:", service); // 🔥
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
                        console.log("🔥 SLOT NO PAI:", slot);
                        alert(`Horário: ${slot.startTime}`);
                    }}
                />
            )}
        </div>
    );
}