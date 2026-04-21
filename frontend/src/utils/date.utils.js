export function formatDateBR(dateString, time) {
  const date = new Date(dateString);

  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString("pt-BR", { month: "long" });

  const capitalizedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${capitalizedWeekday}, ${day} de ${month} às ${time}`;
}

export function formatDateBRSafe(dateString, time) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");

  const date = new Date(year, month - 1, day);

  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const monthName = date.toLocaleDateString("pt-BR", { month: "long" });

  const capitalizedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${capitalizedWeekday}, ${day} de ${monthName} às ${time}`;
}