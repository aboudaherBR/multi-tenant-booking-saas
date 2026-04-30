function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
    .trim()
    .replace(/\s+/g, "-") // espaço → hífen
    .replace(/-+/g, "-"); // evita hífen duplicado
}

module.exports = slugify;