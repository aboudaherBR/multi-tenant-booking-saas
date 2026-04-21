export function formatDateBR(dateString, time) {
  if (!dateString) return "";

  const onlyDate = dateString.split("T")[0];
  const [year, month, day] = onlyDate.split("-");

  const date = new Date(year, month - 1, day);

  if (isNaN(date)) return "Data inválida";

  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const monthName = date.toLocaleDateString("pt-BR", { month: "long" });

  const capitalizedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);

  // 🔥 CORREÇÃO AQUI
  const formattedTime = time ? time.slice(0, 5) : "";

  return `${capitalizedWeekday}, ${day} de ${monthName} às ${formattedTime}`;
}