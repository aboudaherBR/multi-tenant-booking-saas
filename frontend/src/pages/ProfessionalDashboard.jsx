import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useParams, useNavigate } from "react-router-dom";
import "../../src/global.css";

export default function ProfessionalDashboard() {

  const [data, setData] = useState(null);



  const {
    companySlug,
    professionalSlug
  } = useParams();

  const navigate = useNavigate();

  async function fetchAppointments() {

    try {

      const data = await api(
        `/public/${companySlug}/${professionalSlug}/dashboard`
      );

      setData(data);

    } catch (error) {

      console.error(
        "Erro ao buscar agendamentos:",
        error
      );
    }
  }

  useEffect(() => {

    fetchAppointments();

    const interval = setInterval(() => {
      fetchAppointments();
    }, 15000);

    return () => clearInterval(interval);

  }, []);

  if (!data) {
    return <div>Carregando...</div>;
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)"
      }}
    >

      {/* HEADER */}
      <div className="header-gradient">

        <h2 style={{ color: "white" }}>
          Agenda do profissional
        </h2>

      </div>

      {/* CONTEÚDO */}
      <div
        className="container-main"
        style={{
          marginTop: "-40px"
        }}
      >

        <div
          className="card"
          style={{
            padding: "20px"
          }}
        >

          <h1 className="heading">
            Olá, {data.professionalName}
          </h1>

          <p className="subtext">
            Aqui estão seus agendamentos do dia
          </p>

          {/* SUMMARY */}
          <div className="summary-card">

            <div className="summary-label">
              Faturamento hoje
            </div>

            <div className="summary-value">
              R$ {Number(
                data.totalAmount || 0
              ).toFixed(2)}
            </div>

          </div>

          {/* APPOINTMENTS */}
          <div style={{ marginTop: 30 }}>

            <h3>
              Agendamentos
            </h3>

            {(data.appointments || []).length === 0 ? (

              <p>
                Nenhum agendamento hoje
              </p>

            ) : (

              <div>

                {data.appointments.map((appt) => (

                  <div
                    key={appt.id}
                    className="appointment-card"
                  >

                    <div className="appointment-hour">
                      {appt.start_time?.slice(0, 5)}
                    </div>

                    <div className="appointment-content">

                      <div className="appointment-client">
                        {appt.client_name}
                      </div>

                      <div className="appointment-service">
                        {appt.service_name}
                      </div>

                    </div>

                    <div className="appointment-price">
                      R$ {Number(
                        appt.service_price_snapshot || 0
                      ).toFixed(2)}
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* BOTÕES */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              gap: 10
            }}
          >

            <button
              className="button-secondary"
              onClick={() =>
                navigate(
                  `/${companySlug}/${professionalSlug}/reports`
                )
              }
            >
              Relatórios
            </button>

            <button
              className="button-primary"
              onClick={() =>
                alert("Agenda detalhada em breve")
              }
            >
              Agenda
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}