import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SettingsPage() {

    const navigate = useNavigate();

    const [showBusinessHoursModal, setShowBusinessHoursModal] = useState(false);
    const [showScheduleBlocksModal, setShowScheduleBlocksModal] = useState(false);

    const [businessHours, setBusinessHours] = useState([]);
    const [scheduleBlocks, setScheduleBlocks] = useState([]);

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
        "Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"
    ];

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
        await loadBusinessHours();
        setShowBusinessHoursModal(true);
    }

    async function saveBusinessHours() {

        await fetch(
            "http://localhost:3000/business-hours",
            {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hours: businessHours })
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

                const blockStart = block.start_date.slice(0,10);
                const blockEnd = block.end_date.slice(0,10);

                return (
                    blockStart <= filterEndDate &&
                    blockEnd >= filterStartDate
                );
            });
        }

        setFilteredBlocks(result);
    }

    return (
        <div>

            <h1>Configurações</h1>

            <h2>Agenda</h2>

            <button onClick={openBusinessHoursModal}>
                Horário de funcionamento
            </button>

            <button
                onClick={async () => {
                    setSelectedBlock(null);
                    await loadScheduleBlocks();
                    setShowScheduleBlocksModal(true);
                }}
            >
                Bloquear horário
            </button>

            <button onClick={() => navigate("/")}>
                Voltar ao Dashboard
            </button>

            {showScheduleBlocksModal && (

                <div style={{
                    position:"fixed",
                    inset:0,
                    background:"rgba(0,0,0,0.4)",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"
                }}>

                    <div style={{
                        background:"white",
                        padding:"20px",
                        borderRadius:"8px",
                        minWidth:"300px"
                    }}>

                        <h3>Bloqueios de agenda</h3>

                        <div style={{marginBottom:"10px"}}>

                            <input
                                type="date"
                                value={filterStartDate}
                                onChange={(e)=>setFilterStartDate(e.target.value)}
                            />

                            <input
                                type="date"
                                value={filterEndDate}
                                onChange={(e)=>setFilterEndDate(e.target.value)}
                            />

                            <button onClick={applyFilter}>
                                Filtrar
                            </button>

                        </div>

                        {!selectedBlock && (

                            <>
                                <button onClick={()=>setShowNewBlockForm(true)}>
                                    Novo bloqueio
                                </button>

                                {showNewBlockForm && (

                                    <div style={{marginTop:"10px"}}>

                                        <input
                                            type="date"
                                            value={newBlock.startDate}
                                            onChange={(e)=>setNewBlock({...newBlock,startDate:e.target.value})}
                                        />

                                        <input
                                            type="date"
                                            value={newBlock.endDate}
                                            onChange={(e)=>setNewBlock({...newBlock,endDate:e.target.value})}
                                        />

                                        <input
                                            type="time"
                                            value={newBlock.startTime}
                                            onChange={(e)=>setNewBlock({...newBlock,startTime:e.target.value})}
                                        />

                                        <input
                                            type="time"
                                            value={newBlock.endTime}
                                            onChange={(e)=>setNewBlock({...newBlock,endTime:e.target.value})}
                                        />

                                        <input
                                            type="text"
                                            placeholder="Motivo"
                                            value={newBlock.reason}
                                            onChange={(e)=>setNewBlock({...newBlock,reason:e.target.value})}
                                        />

                                        <button onClick={createScheduleBlock}>
                                            Salvar
                                        </button>

                                        <button onClick={()=>setShowNewBlockForm(false)}>
                                            Cancelar
                                        </button>

                                    </div>
                                )}

                                {filteredBlocks.length === 0 && (
                                    <p>Nenhum bloqueio cadastrado.</p>
                                )}

                                {filteredBlocks.length > 0 && (

                                    <table style={{
                                        width:"100%",
                                        borderCollapse:"collapse",
                                        marginTop:"10px"
                                    }}>

                                        <thead>
                                            <tr style={{background:"#f5f5f5"}}>
                                                <th style={{padding:"8px",border:"1px solid #ddd"}}>Início</th>
                                                <th style={{padding:"8px",border:"1px solid #ddd"}}>Fim</th>
                                                <th style={{padding:"8px",border:"1px solid #ddd"}}>Horário</th>
                                                <th style={{padding:"8px",border:"1px solid #ddd"}}>Motivo</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {filteredBlocks.map(block => (

                                                <tr
                                                    key={block.id}
                                                    onClick={()=>setSelectedBlock(block)}
                                                    style={{cursor:"pointer"}}
                                                    onMouseEnter={(e)=>e.currentTarget.style.background="#fafafa"}
                                                    onMouseLeave={(e)=>e.currentTarget.style.background="white"}
                                                >

                                                    <td style={{padding:"8px",border:"1px solid #ddd"}}>
                                                        {block.start_date.slice(0,10)}
                                                    </td>

                                                    <td style={{padding:"8px",border:"1px solid #ddd"}}>
                                                        {block.end_date.slice(0,10)}
                                                    </td>

                                                    <td style={{padding:"8px",border:"1px solid #ddd"}}>
                                                        {block.start_time && block.end_time
                                                            ? `${block.start_time.slice(0,5)} - ${block.end_time.slice(0,5)}`
                                                            : "Dia inteiro"}
                                                    </td>

                                                    <td style={{padding:"8px",border:"1px solid #ddd"}}>
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

                                <p><strong>Início:</strong> {selectedBlock.start_date.slice(0,10)}</p>
                                <p><strong>Fim:</strong> {selectedBlock.end_date.slice(0,10)}</p>

                                <p>
                                    <strong>Horário:</strong>{" "}
                                    {selectedBlock.start_time && selectedBlock.end_time
                                        ? `${selectedBlock.start_time.slice(0,5)} - ${selectedBlock.end_time.slice(0,5)}`
                                        : "Dia inteiro"}
                                </p>

                                <p>
                                    <strong>Motivo:</strong> {selectedBlock.reason || "Sem motivo"}
                                </p>

                                <button
                                    style={{
                                        background:"#ff4d4f",
                                        color:"white",
                                        border:"none",
                                        padding:"6px 10px",
                                        cursor:"pointer"
                                    }}
                                    onClick={()=>deleteScheduleBlock(selectedBlock.id)}
                                >
                                    Excluir bloqueio
                                </button>

                                <button onClick={()=>setSelectedBlock(null)}>
                                    Voltar
                                </button>

                            </div>
                        )}

                        <button onClick={()=>setShowScheduleBlocksModal(false)}>
                            Fechar
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}