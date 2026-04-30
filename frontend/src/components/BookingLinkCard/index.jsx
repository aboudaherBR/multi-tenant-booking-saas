export default function BookingLinkCard({ companySlug }) {
  const baseUrl = window.location.origin;

  const link = companySlug
    ? `${baseUrl}/book/${companySlug}`
    : "";

  return (
    <div className="card" style={{ padding: "20px", marginBottom: "16px" }}>
      <h3 className="heading">Compartilhe seu link</h3>

      <p className="text-muted">Seu link:</p>

      <p>{link || "Carregando..."}</p>
    </div>
  );
}