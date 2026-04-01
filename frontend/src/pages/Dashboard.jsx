export default function Dashboard() {
    const { user } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function loadDashboard() {
        try {
            const response = await apiClient("/dashboard/today");

            // 🔥 GARANTE QUE É ARRAY
            setAppointments(Array.isArray(response) ? response : []);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar dashboard");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            loadDashboard();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Olá, {user?.name}</h1>

            <h2>Hoje</h2>

            <p>Atendimentos: {appointments.length}</p>

            <h2>Agendamentos</h2>
            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment.id}>
                        {/* 🔥 FORMATANDO DATA */}
                        {new Date(appointment.date).toLocaleDateString()} — {appointment.start_time}
                    </li>
                ))}
            </ul>

            <button onClick={() => navigate('/reports')}>
                Relatórios
            </button>
        </div>
    );
}