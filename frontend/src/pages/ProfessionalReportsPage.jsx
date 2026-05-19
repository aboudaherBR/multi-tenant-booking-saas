import "../../src/global.css";
import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useParams } from "react-router-dom";

export default function ProfessionalReportsPage() {


    const [report, setReport] =
        useState(null);

    const {
        companySlug,
        professionalSlug
    } = useParams();

    async function fetchReport() {

        try {

            const today = new Date();

            const startDate =
                new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                )
                    .toISOString()
                    .split("T")[0];

            const endDate =
                new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0
                )
                    .toISOString()
                    .split("T")[0];

            const data = await api(
                `/public/${companySlug}/${professionalSlug}/report?startDate=${startDate}&endDate=${endDate}`
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

                </div>

            </div>

        </div>
    );
}