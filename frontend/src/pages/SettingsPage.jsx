import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfessionalServicesModal from "../components/ProfessionalServicesModal";
import apiClient from "../api/apiClient";

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
    const [showProfessionalsModal, setShowProfessionalsModal] = useState(false);
    const [services, setServices] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [showNewServiceForm, setShowNewServiceForm] = useState(false);

    const [showNewProfessionalForm, setShowNewProfessionalForm] = useState(false);

    const [newProfessional, setNewProfessional] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [newService, setNewService] = useState({
        name: "",
        duration_minutes: "",
        base_price: ""
    });

    const [selectedService, setSelectedService] = useState(null);

    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [showProfessionalServicesModal, setShowProfessionalServicesModal] = useState(false);
    const [professionalServices, setProfessionalServices] = useState([]);

    const [lunchStart, setLunchStart] = useState("");
    const [lunchEnd, setLunchEnd] = useState("");



    async function loadBusinessHours() {

        const data = await apiClient("/business-hours");
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

        const data = await apiClient("/company/settings");
        setLunchStart(data.lunch_start_time?.slice(0, 5) || "");
        setLunchEnd(data.lunch_end_time?.slice(0, 5) || "");

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

        if ((lunchStart && !lunchEnd) || (!lunchStart && lunchEnd)) {
            alert("Preencha início e fim do horário de almoço.");
            return;
        }

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

        // salvar horários
        await apiClient("/business-hours", {
            method: "PUT",
            body: {
                hours: businessHours
            }
        });

        // salvar buffer
        await apiClient("/company/buffer", {
            method: "PUT",
            body: {
                appointmentBufferMinutes: Number(bufferMinutes)
            }
        });

        await apiClient("/company/lunch", {
            method: "PUT",
            body: {
                lunchStartTime: lunchStart || null,
                lunchEndTime: lunchEnd || null
            }
        });

        setShowBusinessHoursModal(false);
    }


    async function loadScheduleBlocks() {

        const data = await apiClient("/schedule-blocks");

        const blocks = data.blocks || [];

        setScheduleBlocks(blocks);
        setFilteredBlocks(blocks);
    }

    async function createScheduleBlock() {

        await apiClient("/schedule-blocks", {
            method: "POST",
            body: {
                startDate: newBlock.startDate,
                endDate: newBlock.endDate,
                startTime: newBlock.startTime || null,
                endTime: newBlock.endTime || null,
                reason: newBlock.reason || null
            }
        });

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

        await apiClient(`/schedule-blocks/${id}`, {
            method: "DELETE"
        });

        await loadScheduleBlocks();

        setSelectedBlock(null);
    }

    async function loadServices() {
        try {
            const data = await apiClient("/services");
            console.log("services retornados:", data);
            setServices(data.services || []);
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
            setServices([]);
        }
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

    async function loadProfessionals() {

        try {

            const data = await apiClient("/professionals");
            console.log("professionals retornados:", data);
            setProfessionals(data);

        } catch (error) {
            console.error("Erro ao carregar profissionais:", error);
            setProfessionals([]);
        }
    }

    async function createService() {
        await apiClient("/services", {
            method: "POST",
            body: {
                name: newService.name,
                duration_minutes: Number(newService.duration_minutes),
                base_price: Number(newService.base_price)
            }
        });

        await loadServices();

        setShowNewServiceForm(false);

        setNewService({
            name: "",
            duration_minutes: "",
            base_price: ""
        });
    }

    async function createProfessional() {

        await apiClient("/professionals", {
            method: "POST",
            body: {
                name: newProfessional.name,
                email: newProfessional.email,
                password: newProfessional.password
            }
        });

        await loadProfessionals();

        setShowNewProfessionalForm(false);

        setNewProfessional({
            name: "",
            email: "",
            password: ""
        });
    }

    async function deleteService(serviceId) {

        const confirmDelete = confirm("Excluir este serviço?");
        if (!confirmDelete) return;

        await apiClient(`/services/${serviceId}`, {
            method: "DELETE"
        });
        await loadServices();
        setSelectedService(null);
    }

    async function openProfessionalServices(professional) {

        setSelectedProfessional(professional);

        try {
            const data = await apiClient(
                `/admin/professionals/${professional.id}/services`
            );

            console.log("SERVICES:", data);
            setProfessionalServices(data);

        } catch (err) {
            console.error("Erro ao carregar serviços do profissional", err);
        }

        setShowProfessionalServicesModal(true);
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

                            <strong>Horário de almoço</strong>

                            <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>

                                <input
                                    type="time"
                                    value={lunchStart}
                                    onChange={(e) => setLunchStart(e.target.value)}
                                />

                                <span>até</span>

                                <input
                                    type="time"
                                    value={lunchEnd}
                                    onChange={(e) => setLunchEnd(e.target.value)}
                                />

                            </div>

                        </div>

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

            <button
                onClick={async () => {

                    console.log("clicou profissionais");

                    await loadProfessionals();

                    console.log("loadProfessionals terminou");

                    setShowProfessionalsModal(true);

                }}
            >
                Profissionais
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

            {showProfessionalsModal && (

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

                        <h3>Profissionais</h3>

                        <button
                            style={{ marginBottom: "10px" }}
                            onClick={() => {
                                setShowNewProfessionalForm(true);
                            }}
                        >
                            Novo profissional
                        </button>
                        {showNewProfessionalForm && (

                            <div style={{ marginBottom: "15px" }}>

                                <input
                                    type="text"
                                    placeholder="Nome"
                                    autoComplete="off"
                                    value={newProfessional.name}
                                    onChange={(e) =>
                                        setNewProfessional({
                                            ...newProfessional,
                                            name: e.target.value
                                        })
                                    }
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    value={newProfessional.email}
                                    onChange={(e) =>
                                        setNewProfessional({
                                            ...newProfessional,
                                            email: e.target.value
                                        })
                                    }
                                />

                                <input
                                    type="password"
                                    placeholder="Senha"
                                    autoComplete="off"
                                    value={newProfessional.password}
                                    onChange={(e) =>
                                        setNewProfessional({
                                            ...newProfessional,
                                            password: e.target.value
                                        })
                                    }
                                />

                                <input
                                    type="text"
                                    name="fake-user"
                                    autoComplete="username"
                                    style={{ display: "none" }}
                                />

                                <input
                                    type="password"
                                    name="fake-pass"
                                    autoComplete="current-password"
                                    style={{ display: "none" }}
                                />

                                <button onClick={createProfessional}>
                                    Salvar
                                </button>

                                <button
                                    onClick={() => setShowNewProfessionalForm(false)}
                                >
                                    Cancelar
                                </button>

                            </div>

                        )}

                        {professionals.length === 0 && (
                            <p>Nenhum profissional cadastrado.</p>
                        )}

                        {professionals.length > 0 && (

                            <table style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: "10px"
                            }}>

                                <thead>
                                    <tr style={{ background: "#f5f5f5" }}>
                                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Nome</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {professionals.map(professional => (
                                        <tr
                                            key={professional.id}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openProfessionalServices(professional)}
                                        >
                                            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                {professional.name}
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>

                            </table>

                        )}

                        <button
                            style={{ marginTop: "10px" }}
                            onClick={() => setShowProfessionalsModal(false)}
                        >
                            Fechar
                        </button>

                    </div>

                </div>

            )}
            {showProfessionalServicesModal && (
                <ProfessionalServicesModal
                    professional={selectedProfessional}
                    services={professionalServices}
                    onClose={() => {
                        setShowProfessionalServicesModal(false);
                        setShowProfessionalsModal(true);
                    }}
                    onServiceAdded={() => openProfessionalServices(selectedProfessional)}
                />
            )}

        </div>
    );
}