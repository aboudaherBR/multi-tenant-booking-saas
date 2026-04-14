export function formatDateBR(dateString, time) {
  const date = new Date(dateString);

  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString("pt-BR", { month: "long" });

  const capitalizedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${capitalizedWeekday}, ${day} de ${month} às ${time}`;
}