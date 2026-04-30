export default function BookingLinkCard({ companySlug }) {
  const baseUrl = window.location.origin;

  const link = companySlug
    ? `${baseUrl}/book/${companySlug}`
    : "";

  console.log("STEP 3 - SLUG NO COMPONENTE:", companySlug);

  return (
    <div className="card" style={{ padding: "20px", marginBottom: "16px" }}>
      <h3 className="heading">Compartilhe seu link</h3>

      <p className="text-muted">Seu link:</p>

      <p>{link || "Carregando..."}</p>

      {/* 🔥 BOTÕES VOLTAM AQUI */}
      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <button className="button-primary" disabled={!link}>
          Copiar link
        </button>

        <button className="button-secondary" disabled={!link}>
          WhatsApp
        </button>
      </div>
    </div>
  );
}