const pool = require('./db');

async function createCompany({ name, slug }) {
  const result = await pool.query(
    `
      INSERT INTO companies (name, slug)
      VALUES ($1, $2)
      RETURNING id, name, slug, status, created_at, subscription_ends_at
    `,
    [name, slug]
  );

  return result.rows[0];
}

async function findCompanyById(companyId) {
  const result = await pool.query(
    `
      SELECT 
        id, 
        status, 
        appointment_buffer_minutes, 
        subscription_ends_at, 
        slot_interval_minutes,
        lunch_start_time,
        lunch_end_time
      FROM companies
      WHERE id = $1
    `,
    [companyId]
  );

  return result.rows[0];
}

async function updateCompanyLunch(companyId, lunchStart, lunchEnd) {
  await pool.query(
    `
      UPDATE companies
      SET lunch_start_time = $2,
          lunch_end_time   = $3
      WHERE id = $1
    `,
    [companyId, lunchStart, lunchEnd]
  );
}

async function findCompanyBySlug(slug) {
  console.log('slug bruto:', slug);
  console.log('slug tamanho:', slug.length);
  const result = await pool.query(
    `
      SELECT id,
             name,
             slug,
             status,
             slot_interval_minutes
      FROM companies
      WHERE slug = $1
      LIMIT 1
    `,
    [slug]
  );

  return result.rows[0] || null;
}

async function updateCompanyBuffer({
  companyId,
  appointmentBufferMinutes
}) {

  const query = `
    UPDATE companies
    SET appointment_buffer_minutes = $1
    WHERE id = $2
    RETURNING appointment_buffer_minutes
  `;

  const values = [appointmentBufferMinutes, companyId];

  const { rows } = await pool.query(query, values);

  return rows[0];
}

module.exports = {
  createCompany,
  findCompanyById,
  updateCompanyLunch,
  findCompanyBySlug,
  updateCompanyBuffer
};