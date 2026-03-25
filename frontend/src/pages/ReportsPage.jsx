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

      const data = await apiClient(url);

      setSummary(data);

    } catch (error) {

      console.error("Erro ao carregar relatório", error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

      <h1>Relatórios</h1>

      <button onClick={() => navigate("/")}>
        ← Voltar ao Dashboard
      </button>

      <div style={{ marginTop: "20px" }}>

        <label>Data inicial</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label style={{ marginLeft: "10px" }}>Data final</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label style={{ marginLeft: "10px" }}>Profissional</label>

        <select
          value={professionalId}
          onChange={(e) => setProfessionalId(e.target.value)}
        >
          <option value="">Todos</option>

          {professionals.map((professional) => (
            <option key={professional.id} value={professional.id}>
              {professional.name}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: "10px" }}>Serviço</label>

        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
        >
          <option value="">Todos</option>

          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => loadSummary(startDate, endDate)}
        >
          Atualizar
        </button>

      </div>

      {loading ? (
        <p style={{ marginTop: "20px" }}>Atualizando dados...</p>
      ) : summary && (
        <div style={{ marginTop: "20px" }}>

          <h2>
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
          </h2>

          <p>
            Total de serviços: <strong>{summary.totalServices}</strong>
          </p>

          <p>
            Faturamento: <strong>R$ {summary.totalRevenue}</strong>
          </p>

          <p>
            Ticket médio: <strong>R$ {summary.ticketAverage.toFixed(2)}</strong>
          </p>

        </div>
      )}

    </div>
  );
}