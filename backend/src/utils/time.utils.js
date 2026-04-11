/**
 * Retorna a data/hora atual no horário do Brasil (São Paulo),
 * independente do fuso do servidor (ex: UTC no Render).
 *
 * Essa função deve ser a ÚNICA fonte de "agora" para regras de negócio.
 */
function getBusinessNow() {
  return new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'America/Sao_Paulo'
    })
  );
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD
 * usando o horário do negócio (Brasil).
 */
function getBusinessToday() {
  return getBusinessNow().toLocaleDateString('en-CA');
}

module.exports = {
  getBusinessNow,
  getBusinessToday
};