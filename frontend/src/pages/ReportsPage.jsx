import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function ReportsPage() {

  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [professionals, setProfessionals] = useState([]);
  const [professionalId, setProfessionalId] = useState("");

  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");

  const today = new Date();

  const monthName = today.toLocaleString("pt-BR", {
    month: "long"
  });

  const year = today.getFullYear();

  // 🔹 inicialização
  useEffect(() => {

    const today = new Date();

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    setStartDate(firstDay);
    setEndDate(lastDay);

    loadSummary(firstDay, lastDay);
    loadProfessionals();
    loadServices();

  }, []);

  // 🔥 auto refresh leve (60s)
  useEffect(() => {

    const interval = setInterval(() => {
      if (startDate && endDate) {
        loadSummary(startDate, endDate);
      }
    }, 60000);

    return () => clearInterval(interval);

  }, [startDate, endDate, professionalId, serviceId]);

  // 🔥 auto update ao mudar filtros
  useEffect(() => {
    if (startDate && endDate) {
      loadSummary(startDate, endDate);
    }
  }, [professionalId, serviceId]);

  async function loadProfessionals() {
    try {
      const data = await apiClient("/professionals");
      setProfessionals(data);
    } catch (error) {
      console.error("Erro ao carregar profissionais", error);
    }
  }

  async function loadServices() {
    try {
      const data = await apiClient("/services");
      setServices(data.services || data);
    } catch (error) {
      console.error("Erro ao carregar serviços", error);
    }
  }

  async function loadSummary(start, end) {

    try {
      
      setLoading(true);

      let url = `/reports/summary?startDate=${start}&endDate=${end}`;

      if (professionalId) {
        url += `&professionalId=${professionalId}`;
      }

      if (serviceId) {
        url += `&serviceId=${serviceId}`;
      }
      console.log("URL FINAL:", url);

      const data = await apiClient(url);

      setSummary(data);

    } catch (error) {

      console.error("Erro ao carregar relatório", error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>

      {/* HEADER */}
      <div className="header-gradient">
        <h2 style={{ color: "white" }}>Relatórios</h2>
      </div>

      {/* FILTROS */}
      <div className="container-main" style={{ marginTop: "-40px" }}>
        <div className="card" style={{ padding: "20px" }}>

          <h2 className="heading">Filtros</h2>

          <div className="mb-10">
            <button
              className="button-secondary"
              onClick={() => navigate("/")}
            >
              Voltar ao início
            </button>
          </div>

          <div className="mb-10">
            <label className="subtext">Data inicial</label>
            <input
              className="input-field"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="mb-10">
            <label className="subtext">Data final</label>
            <input
              className="input-field"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="mb-10">
            <label className="subtext">Profissional</label>
            <select
              className="input-field"
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
            >
              <option value="">Todos</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-10">
            <label className="subtext">Serviço</label>
            <select
              className="input-field"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="">Todos</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>



        </div>
      </div>

      {/* RESULTADO */}
      <div className="container-main">
        <div className="card" style={{ padding: "20px" }}>

          {loading ? (
            <p className="text-muted">Atualizando dados...</p>
          ) : summary ? (
            <>
              <h2 className="heading">
                {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
              </h2>

              <div className="mb-20">
                <p className="text-row">
                  <strong>Total de serviços:</strong> {summary.totalServices}
                </p>

                <p className="text-row">
                  <strong>Faturamento:</strong>{" "}
                  R$ {Number(summary.totalRevenue).toLocaleString("pt-BR")}
                </p>

                <p className="text-row">
                  <strong>Ticket médio:</strong>{" "}
                  R$ {Number(summary.ticketAverage).toFixed(2)}
                </p>
              </div>
            </>
          ) : (
            <p className="text-muted">Nenhum dado disponível</p>
          )}

        </div>
      </div>

    </div>
  );
}