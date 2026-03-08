import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ScheduleWizard() {
    const [step, setStep] = useState('professional');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [appointment, setAppointment] = useState({
        professional: null,
        service: null,
        time: null,
        client: null
    });

    const navigate = useNavigate();

    const handleConfirm = async () => {
        try {
            const response = await fetch('http://localhost:3000/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(appointment)
            });

            const data = await response.json();

            console.log('Agendamento criado:', data);

            setShowConfirmModal(false);

            // voltar para dashboard
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

                    <button
                        onClick={() => {
                            setAppointment({ ...appointment, professional: 'Maria' });
                            setStep('service');
                        }}
                    >
                        Maria
                    </button>
                </div>
            )}

            {step === 'service' && (
                <div>
                    <button onClick={() => setStep('professional')}>
                        ← Voltar
                    </button>

                    <h3>Escolher serviço</h3>

                    <button
                        onClick={() => {
                            setAppointment({ ...appointment, service: 'Corte' });
                            setStep('time');
                        }}
                    >
                        Corte
                    </button>
                </div>
            )}

            {step === 'time' && (
                <div>
                    <button onClick={() => setStep('service')}>
                        ← Voltar
                    </button>

                    <h3>Escolher horário</h3>

                    <button
                        onClick={() => {
                            setAppointment({ ...appointment, time: '10:00' });
                            setStep('client');
                        }}
                    >
                        10:00
                    </button>
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
                            setAppointment({ ...appointment, client: 'Maria Silva' });
                            setShowConfirmModal(true);
                        }}
                    >
                        Maria Silva
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

                        <p>Profissional: {appointment.professional}</p>
                        <p>Serviço: {appointment.service}</p>
                        <p>Horário: {appointment.time}</p>
                        <p>Cliente: {appointment.client}</p>

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