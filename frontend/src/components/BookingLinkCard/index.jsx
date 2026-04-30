export default function BookingLinkCard() {
  return (
    <div className="card" style={{ padding: "20px", marginBottom: "16px" }}>
      <h3 className="heading">Compartilhe seu link</h3>

      <p className="text-muted">Seu link:</p>
      <p>app.com/book/seu-slug</p>

      <button className="button-primary">Copiar link</button>
      <button className="button-secondary">Enviar no WhatsApp</button>
    </div>
  );
}