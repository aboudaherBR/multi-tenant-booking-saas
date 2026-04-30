import { useState } from "react";

export default function BookingLinkCard({ companySlug }) {
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin;

  const link = companySlug
    ? `${baseUrl}/book/${companySlug}`
    : "";

  async function handleCopy() {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  }

  return (
    <div className="card" style={{ padding: "20px", marginBottom: "16px" }}>
      <h3 className="heading">Compartilhe seu link</h3>

      <p className="text-muted">Seu link:</p>

      <p>{link || "Carregando..."}</p>

      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <button
          className="button-primary"
          onClick={handleCopy}
          disabled={!link}
        >
          {copied ? "Copiado!" : "Copiar link"}
        </button>

        <button className="button-secondary" disabled={!link}>
          WhatsApp
        </button>
      </div>
    </div>
  );
}