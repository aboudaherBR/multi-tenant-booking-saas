import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';


function ScheduleWizard() {
    const [step, setStep] = useState('professional');
    const [professionals, setProfessionals] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    

    const [appointment, setAppointment] = useState({
        professional: null,
        service: null,
        time: null,
        client: null
    });

    const [services, setServices] = useState([]);

    const [slots, setSlots] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        async function fetchProfessionals() {
            try {
                const data = await apiClient('/professionals');
                setProfessionals(data);
            } catch (error) {
                console.error('Erro ao buscar profissionais', error);
            }
        }

        fetchProfessionals();
    }, []);


    const navigate = useNavigate();

    const handleConfirm = async () => {
        try {

            const payload = {
                professionalId: appointment.professional.id,
                serviceId: appointment.service.id,
                clientName: appointment.client.name,
                clientPhone: appointment.client.phone,
                date: selectedDate,
                startTime: appointment.time
            };

            const response = await apiClient(
                '/appointments',
                {
                    method: 'POST',
                    body: payload
                }
            );

            console.log('Agendamento criado:', response);

            setShowConfirmModal(false);

            // 🔹 atualizar slots novamente
            const availability = await apiClient(
                `/availability?professionalId=${appointment.professional.id}&serviceId=${appointment.service.id}&date=${selectedDate}`
            );

            setSlots(availability.slots);

            navigate('/');

        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
        }
    };

    return (
        <div>
            <h2>Novo Agendamento</h2>

            {step === 'professional' && (
                <div>
                    <h3>Escolher profissional</h3>


                    {professionals.map((professional) => (
                        <button
                            key={professional.id}
                            onClick={async () => {
                                try {
                                    const data = await apiClient(`/professionals/${professional.id}/services`);

                                    setServices(data.services);;

                                    setAppointment({
                                        ...appointment,
                                        professional: professional
                                    });

                                    setStep('service');

                                } catch (error) {
                                    console.error('Erro ao buscar serviços', error);
                                }
                            }}
                        >
                            {professional.name}
                        </button>
                    ))}

                </div>
            )}

            {step === 'service' && (
                <div>
                    <button onClick={() => setStep('professional')}>
                        ← Voltar
                    </button>

                    <h3>Escolher serviço</h3>


                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => {
                                setAppointment({
                                    ...appointment,
                                    service: service
                                });

                                setStep('time');
                            }}
                        >
                            {service.name}
                        </button>
                    ))}
                </div>
            )}

            {step === 'time' && (
                <div>
                    <button onClick={() => setStep('service')}>
                        ← Voltar
                    </button>

                    <h3>Escolher horário</h3>

                    <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={selectedDate}
                        onChange={async (e) => {
                            const date = e.target.value;
                            setSelectedDate(date);

                            try {
                                const response = await apiClient(
                                    `/availability?professionalId=${appointment.professional.id}&serviceId=${appointment.service.id}&date=${date}`
                                );

                                setSlots(response.slots);

                            } catch (error) {
                                console.error('Erro ao buscar horários', error);
                            }
                        }}
                    />

                    {slots.length === 0 ? (
                        <p>Nenhum horário disponível.</p>
                    ) : (
                        slots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => {
                                    setAppointment({
                                        ...appointment,
                                        time: slot
                                    });

                                    setStep('client');
                                }}
                            >
                                {slot}
                            </button>
                        ))
                    )}
                </div>
            )}

            {step === 'client' && (
                <div>
                    <button onClick={() => setStep('time')}>
                        ← Voltar
                    </button>

                    <h3>Escolher cliente</h3>

                    <button
                        onClick={() => {
                            setAppointment({
                                ...appointment,
                                client: {
                                    name: "Cliente Teste",
                                    phone: "11999999999"
                                }
                            });

                            setShowConfirmModal(true);
                        }}
                    >
                        Cliente Teste
                    </button>
                </div>
            )}
            {showConfirmModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '12px',
                            width: '90%',
                            maxWidth: '400px'
                        }}
                    >
                        <h3>Confirmar agendamento</h3>

                        <p>Profissional: {appointment.professional?.name}</p>
                        <p>Serviço: {appointment.service?.name}</p>
                        <p>Horário: {appointment.time}</p>
                        <p>Cliente: {appointment.client?.name}</p>
                        <p>Telefone: {appointment.client?.phone}</p>

                        <button onClick={() => setShowConfirmModal(false)}>
                            Cancelar
                        </button>

                        <button onClick={handleConfirm}>
                            Confirmar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScheduleWizard;