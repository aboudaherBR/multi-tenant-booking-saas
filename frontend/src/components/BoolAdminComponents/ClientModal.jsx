import { useState } from "react";
import apiClient from "../api/apiClient";

export default function ClientModal({
    onClose,
    onSelect
}) {

    const [mode, setMode] =
        useState(null);

    return (

        <div className="modal-backdrop">

            <div className="modal-content">

                <h3>
                    Selecionar cliente
                </h3>

                {!mode && (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            marginTop: "20px"
                        }}
                    >

                        <button
                            className="button-primary"
                            onClick={async () => {

                                setMode("existing");

                                try {

                                    const data = await apiClient(
                                        "/clients/search"
                                    );

                                    console.log(data);

                                } catch (err) {

                                    console.error(err);
                                }
                            }}
                        >
                            Cliente existente
                        </button>

                        <button
                            className="button-secondary"
                            onClick={() =>
                                setMode("new")
                            }
                        >
                            Novo cliente
                        </button>

                    </div>
                )}

                {mode === "existing" && (

                    <div
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        <input
                            className="input-field"
                            type="text"
                            placeholder="Buscar cliente"
                        />

                        <div
                            style={{
                                marginTop: "15px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px"
                            }}
                        >

                            <button
                                className="button-soft"
                                onClick={() => {

                                    onSelect({
                                        id: 1,
                                        name: "João"
                                    });

                                }}
                            >
                                João - (85) 99999-9999
                            </button>

                            <button
                                className="button-soft"
                                onClick={() => {

                                    onSelect({
                                        id: 2,
                                        name: "Maria"
                                    });

                                }}
                            >
                                Maria - (85) 98888-8888
                            </button>

                        </div>

                    </div>
                )}

                {mode === "new" && (

                    <div
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        <p>
                            Cadastro rápido virá aqui
                        </p>

                    </div>
                )}

                <button
                    className="button-soft"
                    style={{
                        marginTop: "20px"
                    }}
                    onClick={onClose}
                >
                    Fechar
                </button>

            </div>

        </div>
    );
}