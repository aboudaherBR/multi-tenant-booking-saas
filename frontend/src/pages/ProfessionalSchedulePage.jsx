import "../../src/global.css";

import { useEffect, useState } from "react";
import api from "../api/apiClient";

import {
  useNavigate,
  useParams
} from "react-router-dom";

export default function ProfessionalSchedulePage() {

  const [appointments, setAppointments] =
    useState([]);

  const [date, setDate] =
    useState(
      new Date().toISOString().slice(0, 10)
    );

  const navigate = useNavigate();

  const {
    companySlug,
    professionalSlug
  } = useParams();

  async function fetchAppointments() {

    try {

      const data = await api(
        `/public/${companySlug}/${professionalSlug}/dashboard?date=${date}`
      );

      setAppointments(
        data.appointments || []
      );

    } catch (error) {

      console.error(
        "Erro ao buscar agenda:",
        error
      );
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, [date]);

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
          Agenda
        </h2>

      </div>

      {/* CONTENT */}
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
            Agenda do profissional
          </h1>

          <p className="subtext">
            Visualize seus agendamentos
          </p>

          {/* ACTIONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-end",
              flexWrap: "wrap"
            }}
          >

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >

              <label className="subtext">
                Data
              </label>

              <input
                className="input-field"
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />

            </div>

            <button
              className="button-secondary"
              onClick={() =>
                navigate("/professional")
              }
            >
              Dashboard
            </button>

          </div>

          {/* APPOINTMENTS */}
          <div
            style={{
              marginTop: "24px"
            }}
          >

            {(appointments || []).length === 0 ? (

              <p className="subtext">
                Nenhum agendamento
              </p>

            ) : (

              <div>

                {appointments.map((appt) => (

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

        </div>

      </div>

    </div>
  );
}