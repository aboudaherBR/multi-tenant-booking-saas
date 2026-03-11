import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SettingsPage() {

    const navigate = useNavigate();

    const [showBusinessHoursModal, setShowBusinessHoursModal] = useState(false);
    const [showScheduleBlocksModal, setShowScheduleBlocksModal] = useState(false);

    const [businessHours, setBusinessHours] = useState([]);
    const [scheduleBlocks, setScheduleBlocks] = useState([]);
    const [bufferMinutes, setBufferMinutes] = useState(0);
    const [slotInterval, setSlotInterval] = useState(5);

    const [showNewBlockForm, setShowNewBlockForm] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState(null);

    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filteredBlocks, setFilteredBlocks] = useState([]);

    const [newBlock, setNewBlock] = useState({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        reason: ""
    });

    const weekdayNames = [
        "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
    ];

    const [showServicesModal, setShowServicesModal] = useState(false);
    const [services, setServices] = useState([]);
    const [showNewServiceForm, setShowNewServiceForm] = useState(false);

    const [newService, setNewService] = useState({
        name: "",
        duration_minutes: "",
        base_price: ""
    });

    const [selectedService, setSelectedService] = useState(null);



    async function loadBusinessHours() {

        const response = await fetch(
            "http://localhost:3000/business-hours",
            { credentials: "include" }
        );

        const data = await response.json();

        const days = [];

        for (let i = 0; i <= 6; i++) {

            const existing = data.find(d => d.weekday === i);

            if (existing) {
                days.push(existing);
            } else {
                days.push({
                    weekday: i,
                    start_time: "09:00:00",
                    end_time: "18:00:00",
                    is_active: false
                });
            }
        }

        setBusinessHours(days);
    }

    async function openBusinessHoursModal() {

        console.log("abrindo modal");
        await loadBusinessHours();

        const response = await fetch(
            "http://localhost:3000/company/settings",
            { credentials: "include" }
        );

        const data = await response.json();
        setBufferMinutes(data.appointment_buffer_minutes || 0);
        setSlotInterval(data.slot_interval_minutes || 5);
        setShowBusinessHoursModal(true);
    }

    function isMultipleOfInterval(time, interval) {

        const [hours, minutes] = time.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes;
        return totalMinutes % interval === 0;
    }

    async function saveBusinessHours() {

        for (const day of businessHours) {

            if (!day.is_active) continue;

            const start = day.start_time.slice(0, 5);
            const end = day.end_time.slice(0, 5);

            if (
                !isMultipleOfInterval(start, slotInterval) ||
                !isMultipleOfInterval(end, slotInterval)
            ) {
                alert("Os horários precisam respeitar o intervalo da agenda.");
                return;
            }

        }

        console.log("saveBusinessHours executou");
        console.log("buffer atual:", bufferMinutes);

        await fetch(
            "http://localhost:3000/business-hours",
            {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hours: businessHours })
            }
        );
        await fetch(
            "http://localhost:3000/company/buffer",
            {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    appointmentBufferMinutes: Number(bufferMinutes)
                })
            }
        );

        setShowBusinessHoursModal(false);
    }

    async function loadScheduleBlocks() {

        const response = await fetch(
            "http://localhost:3000/schedule-blocks",
            { credentials: "include" }
        );

        const data = await response.json();

        const blocks = data.blocks || [];

        setScheduleBlocks(blocks);
        setFilteredBlocks(blocks);
    }

    async function createScheduleBlock() {

        const response = await fetch(
            "http://localhost:3000/schedule-blocks",
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    startDate: newBlock.startDate,
                    endDate: newBlock.endDate,
                    startTime: newBlock.startTime || null,
                    endTime: newBlock.endTime || null,
                    reason: newBlock.reason || null
                })
            }
        );

        await response.json();

        await loadScheduleBlocks();

        setShowNewBlockForm(false);

        setNewBlock({
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            reason: ""
        });
    }

    async function deleteScheduleBlock(id) {

        const response = await fetch(
            `http://localhost:3000/schedule-blocks/${id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        await response.json();

        await loadScheduleBlocks();

        setSelectedBlock(null);
    }

    function applyFilter() {

        let result = scheduleBlocks;

        if (filterStartDate && filterEndDate) {

            result = result.filter(block => {

                const blockStart = block.start_date.slice(0, 10);
                const blockEnd = block.end_date.slice(0, 10);

                return (
                    blockStart <= filterEndDate &&
                    blockEnd >= filterStartDate
                );
            });
        }

        setFilteredBlocks(result);
    }

    async function loadServices() {

        try {

            const response = await fetch(
                "http://localhost:3000/services",
                { credentials: "include" }
            );

            const data = await response.json();
            console.log("services retornados:", data);
            setServices(data.services || []);

        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
            setServices([]);

        }

    }

    async function createService() {

        const response = await fetch(
            "http://localhost:3000/services",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: newService.name,
                    duration_minutes: Number(newService.duration_minutes),
                    base_price: Number(newService.base_price)
                })
            }
        );

        await response.json();

        await loadServices();

        setShowNewServiceForm(false);

        setNewService({
            name: "",
            duration_minutes: "",
            base_price: ""
        });

    }

    async function deleteService(serviceId) {

        const confirmDelete = confirm("Excluir este serviço?");

        if (!confirmDelete) return;

        await fetch(
            `http://localhost:3000/services/${serviceId}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        await loadServices();

        setSelectedService(null);
    }

    return (
        <div>

            <h1>Configurações</h1>

            <h2>Agenda</h2>

            <button
                onClick={() => {
                    console.log("clicou horario funcionamento");
                    openBusinessHoursModal();
                }}
            >
                Horário de funcionamento
            </button>
            {showBusinessHoursModal && (

                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>

                    <div style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        minWidth: "300px"
                    }}>

                        <h3>Horário de funcionamento</h3>

                        {businessHours.map(day => (

                            <div key={day.weekday} style={{ marginBottom: "10px" }}>

                                <strong>{weekdayNames[day.weekday]}</strong>

                                <div style={{ display: "flex", gap: "8px" }}>

                                    <input
                                        type="checkbox"
                                        checked={day.is_active}
                                        onChange={(e) => {
                                            const updated = businessHours.map(d =>
                                                d.weekday === day.weekday
                                                    ? { ...d, is_active: e.target.checked }
                                                    : d
                                            );
                                            setBusinessHours(updated);
                                        }}
                                    />

                                    <input
                                        type="time"
                                        value={day.start_time.slice(0, 5)}
                                        disabled={!day.is_active}
                                        onChange={(e) => {
                                            const updated = businessHours.map(d =>
                                                d.weekday === day.weekday
                                                    ? { ...d, start_time: e.target.value + ":00" }
                                                    : d
                                            );
                                            setBusinessHours(updated);
                                        }}
                                    />

                                    <span>até</span>

                                    <input
                                        type="time"
                                        value={day.end_time.slice(0, 5)}
                                        disabled={!day.is_active}
                                        onChange={(e) => {
                                            const updated = businessHours.map(d =>
                                                d.weekday === day.weekday
                                                    ? { ...d, end_time: e.target.value + ":00" }
                                                    : d
                                            );
                                            setBusinessHours(updated);
                                        }}
                                    />

                                </div>

                            </div>

                        ))}

                        <div style={{ marginTop: "15px" }}>

                            <strong>Tempo entre clientes (minutos)</strong>

                            <div style={{ marginTop: "5px" }}>

                                <input
                                    type="number"
                                    min="0"
                                    max="60"
                                    value={bufferMinutes}
                                    onChange={(e) => setBufferMinutes(e.target.value)}
                                />

                            </div>

                        </div>

                        <button onClick={saveBusinessHours}>
                            Salvar
                        </button>

                        <button onClick={() => setShowBusinessHoursModal(false)}>
                            Fechar
                        </button>

                    </div>

                </div>

            )}

            <button
                onClick={async () => {
                    setSelectedBlock(null);
                    await loadScheduleBlocks();
                    setShowScheduleBlocksModal(true);
                }}
            >
                Bloquear horário
            </button>

            <h2>Cadastros</h2>

            <button
                onClick={async () => {

                    console.log("clicou serviços");
                    setSelectedService(null);   // ← reset
                    await loadServices();
                    setShowServicesModal(true);
                }}
            >
                Serviços
            </button>

            <button onClick={() => navigate("/")}>
                Voltar ao Dashboard
            </button>

            {showScheduleBlocksModal && (

                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>

                    <div style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        minWidth: "300px"
                    }}>

                        <h3>Bloqueios de agenda</h3>

                        <div style={{ marginBottom: "10px" }}>

                            <input
                                type="date"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                            />

                            <input
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                            />

                            <button onClick={applyFilter}>
                                Filtrar
                            </button>

                        </div>

                        {!selectedBlock && (

                            <>
                                <button onClick={() => setShowNewBlockForm(true)}>
                                    Novo bloqueio
                                </button>

                                {showNewBlockForm && (

                                    <div style={{ marginTop: "10px" }}>

                                        <input
                                            type="date"
                                            value={newBlock.startDate}
                                            onChange={(e) => setNewBlock({ ...newBlock, startDate: e.target.value })}
                                        />

                                        <input
                                            type="date"
                                            value={newBlock.endDate}
                                            onChange={(e) => setNewBlock({ ...newBlock, endDate: e.target.value })}
                                        />

                                        <input
                                            type="time"
                                            value={newBlock.startTime}
                                            onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                                        />

                                        <input
                                            type="time"
                                            value={newBlock.endTime}
                                            onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                                        />

                                        <input
                                            type="text"
                                            placeholder="Motivo"
                                            value={newBlock.reason}
                                            onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                                        />

                                        <button onClick={createScheduleBlock}>
                                            Salvar
                                        </button>

                                        <button onClick={() => setShowNewBlockForm(false)}>
                                            Cancelar
                                        </button>

                                    </div>
                                )}

                                {filteredBlocks.length === 0 && (
                                    <p>Nenhum bloqueio cadastrado.</p>
                                )}

                                {filteredBlocks.length > 0 && (

                                    <table style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        marginTop: "10px"
                                    }}>

                                        <thead>
                                            <tr style={{ background: "#f5f5f5" }}>
                                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Início</th>
                                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Fim</th>
                                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Horário</th>
                                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Motivo</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {filteredBlocks.map(block => (

                                                <tr
                                                    key={block.id}
                                                    onClick={() => setSelectedBlock(block)}
                                                    style={{ cursor: "pointer" }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                                                >

                                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                        {block.start_date.slice(0, 10)}
                                                    </td>

                                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                        {block.end_date.slice(0, 10)}
                                                    </td>

                                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                        {block.start_time && block.end_time
                                                            ? `${block.start_time.slice(0, 5)} - ${block.end_time.slice(0, 5)}`
                                                            : "Dia inteiro"}
                                                    </td>

                                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                        {block.reason || "—"}
                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                )}

                            </>
                        )}

                        {selectedBlock && (

                            <div>

                                <h4>Detalhes do bloqueio</h4>

                                <p><strong>Início:</strong> {selectedBlock.start_date.slice(0, 10)}</p>
                                <p><strong>Fim:</strong> {selectedBlock.end_date.slice(0, 10)}</p>

                                <p>
                                    <strong>Horário:</strong>{" "}
                                    {selectedBlock.start_time && selectedBlock.end_time
                                        ? `${selectedBlock.start_time.slice(0, 5)} - ${selectedBlock.end_time.slice(0, 5)}`
                                        : "Dia inteiro"}
                                </p>

                                <p>
                                    <strong>Motivo:</strong> {selectedBlock.reason || "Sem motivo"}
                                </p>

                                <button
                                    style={{
                                        background: "#ff4d4f",
                                        color: "white",
                                        border: "none",
                                        padding: "6px 10px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => deleteScheduleBlock(selectedBlock.id)}
                                >
                                    Excluir bloqueio
                                </button>

                                <button onClick={() => setSelectedBlock(null)}>
                                    Voltar
                                </button>

                            </div>
                        )}

                        <button onClick={() => setShowScheduleBlocksModal(false)}>
                            Fechar
                        </button>

                    </div>

                </div>
            )}

            {showServicesModal && (

                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>

                    <div style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        minWidth: "400px"
                    }}>

                        <h3>Serviços</h3>

                        {!selectedService && (

                            <button
                                style={{ marginBottom: "10px" }}
                                onClick={() => setShowNewServiceForm(true)}
                            >
                                Novo serviço
                            </button>

                        )}
                        {!selectedService && showNewServiceForm && (

                            <div style={{ marginBottom: "15px" }}>

                                <input
                                    type="text"
                                    placeholder="Nome do serviço"
                                    value={newService.name}
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            name: e.target.value
                                        })
                                    }
                                />

                                <input
                                    type="number"
                                    placeholder="Duração (minutos)"
                                    value={newService.duration_minutes}
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            duration_minutes: e.target.value
                                        })
                                    }
                                />

                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Preço"
                                    value={newService.base_price}
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            base_price: e.target.value
                                        })
                                    }
                                />

                                <button onClick={createService}>
                                    Salvar
                                </button>

                                <button onClick={() => setShowNewServiceForm(false)}>
                                    Cancelar
                                </button>

                            </div>

                        )}

                        {services.length === 0 && (
                            <p>Nenhum serviço cadastrado.</p>
                        )}

                        {!selectedService && services.length > 0 && (

                            <table style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: "10px"
                            }}>

                                <thead>
                                    <tr style={{ background: "#f5f5f5" }}>
                                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Nome</th>
                                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Duração</th>
                                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Preço</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {services.map(service => (

                                        <tr
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            style={{ cursor: "pointer" }}
                                        >

                                            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                {service.name}
                                            </td>

                                            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                {service.duration_minutes} min
                                            </td>

                                            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                R$ {service.base_price}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        )}

                        {selectedService && (

                            <div>

                                <h4>Detalhes do serviço</h4>

                                <p>
                                    <strong>Nome:</strong> {selectedService.name}
                                </p>

                                <p>
                                    <strong>Duração:</strong> {selectedService.duration_minutes} min
                                </p>

                                <p>
                                    <strong>Preço:</strong> R$ {selectedService.base_price}
                                </p>

                                <button
                                    style={{
                                        background: "#ff4d4f",
                                        color: "white",
                                        border: "none",
                                        padding: "6px 10px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => deleteService(selectedService.id)}
                                >
                                    Excluir serviço
                                </button>

                                <button
                                    onClick={() => setSelectedService(null)}
                                >
                                    Voltar
                                </button>

                            </div>

                        )}

                        <button
                            style={{ marginTop: "10px" }}
                            onClick={() => setShowServicesModal(false)}
                        >
                            Fechar
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}