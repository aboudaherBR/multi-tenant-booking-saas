import { useState } from "react";

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
                            onClick={() =>
                                setMode("existing")
                            }
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

                        <p>
                            Busca de clientes virá aqui
                        </p>

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