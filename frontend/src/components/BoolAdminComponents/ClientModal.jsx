import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function ClientModal({
    onClose,
    onSelect
}) {

    const [mode, setMode] =
        useState(null);

    const [clients, setClients] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const filteredClients = clients.filter((client) =>
        client.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const sortedClients = [...filteredClients].sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR")
    );

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

                                    setClients(data);

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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div
                            style={{
                                marginTop: "15px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px"
                            }}
                        >

                            {sortedClients.map((client) => (

                                <button
                                    key={client.id}
                                    className="button-soft"
                                    onClick={() => {

                                        onSelect(client);

                                    }}
                                >

                                    {client.name} - {client.phone}

                                    <br />

                                    <small>
                                        Total gasto: R$ {client.total_spent}
                                    </small>

                                </button>

                            ))}


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