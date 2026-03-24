import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfessionalsModal from "../components/ProfessionalsModal";
import apiClient from "../api/apiClient";

export default function BookPublic() {
  const { slug } = useParams();

  const [phone, setPhone] = useState("");
  const [clientName, setClientName] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [professionals, setProfessionals] = useState([]);

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

    console.log("Iniciar fluxo:", {
      slug,
      phone,
      clientName
    });

    setShowModal(true); // 🔥 ABRE MODAL
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Agende seu horário</h2>

      <p>Informe seus dados para continuar</p>

      <input
        type="text"
        placeholder="Telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <input
        type="text"
        placeholder="Nome"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px"
        }}
      />

      <button
        onClick={handleStart}
        style={{
          width: "100%",
          padding: "12px",
          cursor: "pointer"
        }}
      >
        Procurar profissional
      </button>

      {/* 🔥 MODAL */}
      {showModal && (
        <ProfessionalsModal
          professionals={professionals}
          onClose={() => setShowModal(false)}
          onSelect={(professional) => {
            console.log("Selecionado:", professional);
          }}
        />
      )}
    </div>
  );
}