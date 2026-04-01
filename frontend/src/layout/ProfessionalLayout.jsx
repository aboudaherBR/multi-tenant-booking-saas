import { Outlet } from "react-router-dom";

export default function ProfessionalLayout() {
  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <header style={{ marginBottom: 20 }}>
        <h2>Painel do Profissional</h2>
      </header>

      {/* CONTEÚDO */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}