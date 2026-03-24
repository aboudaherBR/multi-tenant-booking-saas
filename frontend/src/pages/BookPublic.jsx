import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfessionalsModal from "../components/ProfessionalsModal";
import ServicesModal from "../components/ServicesModal";
import apiClient from "../api/apiClient";

export default function BookPublic() {
  const { slug } = useParams();

  const [phone, setPhone] = useState("");
  const [clientName, setClientName] = useState("");

  const [showProfessionalsModal, setShowProfessionalsModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);

  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  // 🔹 buscar profissionais
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

  // 🔹 iniciar fluxo
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

      {/* 🔥 MODAL PROFISSIONAIS */}
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

      {/* 🔥 MODAL SERVIÇOS */}
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
            console.log("Serviço selecionado:", service);
          }}
        />
      )}
    </div>
  );
}