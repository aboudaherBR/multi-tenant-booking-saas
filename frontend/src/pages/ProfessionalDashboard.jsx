import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useParams } from "react-router-dom";

export default function ProfessionalDashboard() {

  const [data, setData] = useState(null);

  const {
    companySlug,
    professionalSlug
  } = useParams();


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
            Olá, Profissional
          </h1>

          <h2 style={{ marginTop: 20 }}>
            Agendamentos de hoje — R${" "}
            {Number(data.totalAmount || 0).toFixed(2)}
          </h2>

          <div style={{ marginTop: 20 }}>

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
                    className="card"
                    style={{
                      padding: "16px",
                      marginTop: "12px"
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >

                      <strong>
                        {appt.start_time?.slice(0, 5)}
                      </strong>

                      <span
                        style={{
                          color: "var(--color-text-secondary)",
                          fontSize: "14px"
                        }}
                      >
                        R$ {Number(
                          appt.service_price_snapshot || 0
                        ).toFixed(2)}
                      </span>

                    </div>

                    <div style={{ marginTop: "10px" }}>

                      <div
                        style={{
                          fontWeight: "600"
                        }}
                      >
                        {appt.client_name}
                      </div>

                      <div
                        style={{
                          color: "var(--color-text-secondary)",
                          marginTop: "4px"
                        }}
                      >
                        {appt.service_name}
                      </div>

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
                alert("Relatórios (em breve)")
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