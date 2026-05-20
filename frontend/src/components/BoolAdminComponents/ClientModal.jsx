import { useState } from "react";

export default function ClientModal({
    onClose,
    onSelect
}) {

    const [name, setName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    function handleSave() {

        if (!name || !phone) {
            return;
        }

        onSelect({
            id: Date.now(),
            name,
            phone
        });
    }

    return (

        <div className="modal-backdrop">

            <div className="modal-content">

                <h3>
                    Novo cliente
                </h3>

                <input
                    className="input-field"
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <input
                    className="input-field"
                    type="text"
                    placeholder="Telefone"
                    value={phone}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                    style={{
                        marginTop: "10px"
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "20px"
                    }}
                >

                    <button
                        className="button-secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="button-primary"
                        onClick={handleSave}
                    >
                        Salvar cliente
                    </button>

                </div>

            </div>

        </div>
    );
}