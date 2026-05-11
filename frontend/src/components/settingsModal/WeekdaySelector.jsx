export default function WeekdaySelector({
    selectedWeekdays,
    setSelectedWeekdays
}) {

    const weekdays = [
        { value: 0, label: "Domingo" },
        { value: 1, label: "Segunda" },
        { value: 2, label: "Terça" },
        { value: 3, label: "Quarta" },
        { value: 4, label: "Quinta" },
        { value: 5, label: "Sexta" },
        { value: 6, label: "Sábado" }
    ];

    return (
        <>
            {weekdays.map((day) => (

                <label
                    key={day.value}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "10px"
                    }}
                >
                    <input
                        type="checkbox"
                        checked={selectedWeekdays.includes(day.value)}
                        onChange={(e) => {

                            if (e.target.checked) {
                                setSelectedWeekdays([
                                    ...selectedWeekdays,
                                    day.value
                                ]);
                            } else {
                                setSelectedWeekdays(
                                    selectedWeekdays.filter(
                                        (d) => d !== day.value
                                    )
                                );
                            }
                        }}
                    />

                    {day.label}

                </label>

            ))}
        </>
    );
}