import "../../src/global.css";
import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useParams } from "react-router-dom";

export default function ProfessionalReportsPage() {

    const [report, setReport] =
        useState(null);

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const {
        companySlug,
        professionalSlug
    } = useParams();

    async function fetchReport() {

        try {

            const today = new Date();

            const initialStartDate =
                new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                )
                    .toISOString()
                    .split("T")[0];

            const initialEndDate =
                new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0
                )
                    .toISOString()
                    .split("T")[0];

            const finalStartDate =
                startDate || initialStartDate;

            const finalEndDate =
                endDate || initialEndDate;

            setStartDate(finalStartDate);
            setEndDate(finalEndDate);

            const data = await api(
                `/public/${companySlug}/${professionalSlug}/report?startDate=${finalStartDate}&endDate=${finalEndDate}`
            );

            setReport(data);

        } catch (error) {

            console.error(
                "Erro ao buscar relatório:",
                error
            );
        }
    }

    useEffect(() => {
        fetchReport();
    }, []);

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "var(--color-bg)"
            }}
        >

            <div className="header-gradient">

                <h2 style={{ color: "white" }}>
                    Relatórios
                </h2>

            </div>

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
                        Relatórios do profissional
                    </h1>

                    <p
                        className="subtext"
                        style={{
                            marginTop: "8px"
                        }}
                    >
                        Período atual: mês corrente
                    </p>

                    <div
                        style={{
                            marginTop: "24px",
                            display: "flex",
                            gap: "12px",
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
                                Início
                            </label>

                            <input
                                className="input-field"
                                style={{
                                    width: "150px"
                                }}
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(e.target.value)
                                }
                            />



                        </div>

                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            marginTop: "12px"
                        }}
                    >

                        <label className="subtext">
                            Fim
                        </label>

                        <input
                            className="input-field"
                            style={{
                                width: "150px"
                            }}
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                        />

                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px"
                        }}
                    >

                        <button
                            className="button-primary"
                            style={{
                                marginTop: "12px",
                                width: "fit-content"
                            }}
                            onClick={fetchReport}
                        >
                            Buscar
                        </button>



                    </div>

                    {report && (

                        <div
                            style={{
                                marginTop: "24px",
                                display: "grid",
                                gap: "16px"
                            }}
                        >

                            <div className="summary-card">

                                <div className="summary-label">
                                    Total de serviços
                                </div>

                                <div className="summary-value">
                                    {report.totalAppointments}
                                </div>

                            </div>

                            <div className="summary-card">

                                <div className="summary-label">
                                    Faturamento
                                </div>

                                <div className="summary-value">
                                    R$ {Number(
                                        report.totalRevenue || 0
                                    ).toFixed(2)}
                                </div>

                            </div>

                            <div className="summary-card">

                                <div className="summary-label">
                                    Ticket médio
                                </div>

                                <div className="summary-value">
                                    R$ {Number(
                                        report.averageTicket || 0
                                    ).toFixed(2)}
                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}