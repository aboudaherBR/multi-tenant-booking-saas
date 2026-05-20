const pool = require('./db');

async function findClientByPhone({ companyId, phone }) {
  const result = await pool.query(
    `
      SELECT id, company_id, name, phone, is_active
      FROM clients
      WHERE company_id = $1
        AND phone = $2
      LIMIT 1
    `,
    [companyId, phone]
  );

  return result.rows[0] || null;
}

const { normalizeBrazilianPhone } = require('../utils/phone.utils');

async function createClient({ companyId, name, phone }) {
  let normalizedPhone;

  try {
    normalizedPhone = normalizeBrazilianPhone(phone);
  } catch (err) {
    throw new Error('Invalid phone');
  }

  const result = await pool.query(
    `
      INSERT INTO clients (
        company_id,
        name,
        phone
      )
      VALUES ($1, $2, $3)
      RETURNING id, company_id, name, phone, created_at, is_active
    `,
    [companyId, name, normalizedPhone]
  );

  return result.rows[0];
}

async function updateClientName({ clientId, companyId, name }) {
  const result = await pool.query(
    `
      UPDATE clients
      SET name = $1
      WHERE id = $2
        AND company_id = $3
      RETURNING id, company_id, name, phone, is_active
    `,
    [name, clientId, companyId]
  );

  return result.rows[0] || null;
}

async function findActiveClientsByCompany(companyId) {
  const result = await pool.query(
    `
      SELECT id, name, phone, is_active, created_at
      FROM clients
      WHERE company_id = $1
        AND is_active = true
      ORDER BY created_at DESC
    `,
    [companyId]
  );

  return result.rows;
}

async function searchClients({
  companyId,
  query
}) {

  const result = await pool.query(
    `
      SELECT
        id,
        name,
        phone
      FROM clients
      WHERE company_id = $1
        AND is_active = true
        AND (
          name ILIKE $2
          OR phone ILIKE $2
        )
      ORDER BY created_at DESC
      LIMIT 10
    `,
    [companyId, `%${query}%`]
  );

  return result.rows;
}

module.exports = {
  findClientByPhone,
  createClient,
  updateClientName,
  findActiveClientsByCompany,
  searchClients
};