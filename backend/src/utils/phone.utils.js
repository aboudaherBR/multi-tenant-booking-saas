function normalizeBrazilianPhone(input) {
  if (!input) {
    throw new Error('Phone is required');
  }


  const digits = input.replace(/\D/g, '');

  // Caso 1: já está com DDI 55 (13 dígitos)
  if (digits.length === 13 && digits.startsWith('55')) {
    return digits;
  }

  // Caso 2: sem DDI (11 dígitos)
  if (digits.length === 11) {
    return `55${digits}`;
  }

  throw new Error('Invalid Brazilian phone number');
}

module.exports = {
  normalizeBrazilianPhone
};