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

async function createClient({ companyId, name, phone }) {
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
    [companyId, name, phone]
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

module.exports = {
  findClientByPhone,
  createClient,
  updateClientName
};