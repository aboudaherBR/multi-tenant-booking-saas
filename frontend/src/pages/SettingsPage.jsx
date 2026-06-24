import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfessionalServicesModal from "../components/ProfessionalServicesModal";
import apiClient from "../api/apiClient";
import BusinessHoursModal from "../components/settingsModal/BusinessHoursModal";
import ScheduleBlocksModal from "../components/settingsModal/ScheduleBlocksModal";
import CreateScheduleBlockModal from "../components/settingsModal/CreateScheduleBlockModal";
import ServicesManagementModal from "../components/settingsModal/ServicesManagementModal";
import ProfessionalsManagementModal from "../components/settingsModal/ProfessionalsManagementModal";




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
        phone: ""
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

    const [blockType, setBlockType] = useState("global");
    const [showCreateBlockModal, setShowCreateBlockModal] = useState(false);

    const [showAppearanceModal, setShowAppearanceModal] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState("pink");



    useEffect(() => {
        async function loadTheme() {
            try {
                const company = await apiClient("/company/settings");
                const theme = company.theme || "pink";
                setSelectedTheme(theme);

                document.documentElement.setAttribute(
                    "data-theme",
                    theme
                );
                localStorage.setItem("theme", theme);

            } catch (error) {
                console.error(error);
            }
        }
        loadTheme();
    }, []);

    console.log("showCreateBlockModal:", showCreateBlockModal);



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

        if (lunchStart && lunchEnd && lunchStart >= lunchEnd) {
            alert("Horário de almoço inválido.");
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
                phone: newProfessional.phone
            }
        });

        await loadProfessionals();

        setNewProfessional({
            name: "",
            phone: ""
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

    async function updateService(service) {

        try {

            await apiClient(
                `/services/${service.id}`,
                {
                    method: "PUT",
                    body: {
                        name: service.name,
                        duration_minutes: Number(service.duration_minutes),
                        base_price: Number(service.base_price)
                    }
                }
            );

            await loadServices();

        } catch (err) {

            console.error("Erro ao atualizar serviço", err);
        }
    }

    async function applyTheme(theme) {

        await apiClient("/company/theme", {
            method: "PUT",
            body: {
                theme
            }
        });

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem("theme", theme);
    }


    return (

        <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>

            {/* HEADER */}
            <div className="header-gradient">
                <h2 style={{ color: "white" }}>
                    Configurações
                </h2>
            </div>

            {/* CONTEÚDO */}
            <div className="container-main" style={{ marginTop: "-40px" }}>



                {/* CARD AGENDA */}
                <div className="card settings-card">
                    <h2 className="heading">Agenda</h2>

                    <button
                        className="button-secondary"
                        onClick={openBusinessHoursModal}
                    >
                        Horário de funcionamento
                    </button>

                    <button
                        className="button-secondary"
                        onClick={async () => {
                            setSelectedBlock(null);

                            await loadScheduleBlocks();
                            await loadProfessionals();

                            setShowScheduleBlocksModal(true);
                        }}
                    >
                        Bloqueios de agenda
                    </button>

                    <button
                        className="button-secondary"
                        onClick={() => {
                            console.log("Promoções do dia clicado");
                        }}
                    >
                        Promoções do dia
                    </button>
                </div>

                {/* 🔥 AQUI, FORA DO CARD */}
                <BusinessHoursModal
                    isOpen={showBusinessHoursModal}
                    onClose={() => setShowBusinessHoursModal(false)}

                    businessHours={businessHours}
                    weekdayNames={weekdayNames}
                    setBusinessHours={setBusinessHours}

                    lunchStart={lunchStart}
                    lunchEnd={lunchEnd}
                    setLunchStart={setLunchStart}
                    setLunchEnd={setLunchEnd}

                    bufferMinutes={bufferMinutes}
                    setBufferMinutes={setBufferMinutes}

                    saveBusinessHours={saveBusinessHours}
                />
                <ScheduleBlocksModal
                    isOpen={showScheduleBlocksModal}
                    onClose={() => setShowScheduleBlocksModal(false)}
                    scheduleBlocks={scheduleBlocks}
                    onCreate={() => setShowCreateBlockModal(true)}
                    reloadBlocks={loadScheduleBlocks}
                />
                <CreateScheduleBlockModal
                    isOpen={showCreateBlockModal}
                    onClose={() => setShowCreateBlockModal(false)}
                    professionals={professionals}
                />





                {/* CARD SERVIÇOS */}
                <div className="card settings-card">
                    <h2 className="heading">Serviços</h2>

                    <button
                        className="button-secondary"
                        onClick={async () => {
                            setSelectedService(null);
                            await loadServices();
                            setShowServicesModal(true);
                        }}
                    >
                        Gerenciar serviços
                    </button>
                </div>

                {/* CARD EQUIPE */}
                <div className="card settings-card">
                    <h2 className="heading">Equipe</h2>

                    <button
                        className="button-secondary"
                        onClick={async () => {
                            await loadProfessionals();
                            setShowProfessionalsModal(true);
                        }}
                    >
                        Gerenciar profissionais
                    </button>
                </div>

                {/* CARD APARÊNCIA */}
                <div className="card settings-card">
                    <h2 className="heading">Aparência</h2>

                    <button
                        className="button-secondary"
                        onClick={() => setShowAppearanceModal(true)}
                    >
                        Personalizar tema
                    </button>
                </div>

                {
                    showAppearanceModal && (
                        <div className="modal-backdrop">
                            <div className="modal-content">
                                <h2>Tema</h2>

                                <div
                                    style={{
                                        marginBottom: "20px",
                                        textAlign: "left"
                                    }}
                                >
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="theme"
                                            value="pink"
                                            checked={selectedTheme === "pink"}
                                            onChange={() => setSelectedTheme("pink")}
                                        />
                                        {" "}Beauty Pink
                                    </label>

                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="theme"
                                            value="dark"
                                            checked={selectedTheme === "dark"}
                                            onChange={() => setSelectedTheme("dark")}
                                        />
                                        {" "}Dark
                                    </label>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            color: "var(--color-text-secondary)"
                                        }}
                                    >
                                        Tema atual: {selectedTheme}
                                    </p>
                                </div>

                                <button
                                    className="button-primary"
                                    onClick={() => applyTheme(selectedTheme)}
                                >
                                    Salvar tema
                                </button>

                                <button
                                    className="button-primary"
                                    onClick={() =>
                                        setShowAppearanceModal(false)
                                    }
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* VOLTAR */}
                <button
                    className="button-primary"
                    onClick={() => navigate("/")}
                >
                    Voltar ao Dashboard
                </button>

            </div>
            <ServicesManagementModal
                isOpen={showServicesModal}
                onClose={() => setShowServicesModal(false)}
                services={services}
                newService={newService}
                setNewService={setNewService}
                onCreate={createService}
                onDelete={deleteService}
                onUpdate={updateService}
            />
            <ProfessionalsManagementModal
                isOpen={showProfessionalsModal}
                onClose={() => setShowProfessionalsModal(false)}
                professionals={professionals}
                newProfessional={newProfessional}
                setNewProfessional={setNewProfessional}
                onCreate={createProfessional}
                selectedProfessional={selectedProfessional}
                setSelectedProfessional={setSelectedProfessional}
                onOpenProfessionalServices={openProfessionalServices}
            />
        </div>
    );
}