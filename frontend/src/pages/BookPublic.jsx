import { useState } from "react";
import { useParams } from "react-router-dom";

export default function BookPublic() {
  const { slug } = useParams();

  const [phone, setPhone] = useState("");
  const [clientName, setClientName] = useState("");

  function handleStart() {
    if (!phone) return;

    console.log("Iniciar fluxo:", {
      slug,
      phone,
      clientName
    });

    // 🔥 FUTURO:
    // abrir modal de profissionais
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
    </div>
  );
}