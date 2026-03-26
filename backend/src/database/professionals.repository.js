const pool = require('./db');

async function findProfessionalById(companyId, professionalId) {
  const result = await pool.query(
    `
      SELECT id
      FROM professionals
      WHERE company_id = $1
      AND id = $2
      AND is_active = true
    `,
    [companyId, professionalId]
  );

  return result.rows[0] || null;
}

async function findProfessionalByUserId({ userId, companyId }) {
  const result = await pool.query(
    `
    SELECT id
    FROM professionals
    WHERE user_id = $1
      AND company_id = $2
    `,
    [userId, companyId]
  );

  return result.rows[0];
}

async function findActiveProfessionalsPublicByCompanyId(companyId) {
  const result = await pool.query(
    `
      SELECT DISTINCT
        p.id,
        p.slug,
        p.photo_url,
        u.name
      FROM professionals p
      JOIN users u
        ON u.id = p.user_id
       AND u.company_id = p.company_id
      JOIN professional_services ps
        ON ps.professional_id = p.id
       AND ps.company_id = p.company_id
      JOIN services s
        ON s.id = ps.service_id
       AND s.company_id = p.company_id
      WHERE
        p.company_id = $1
        AND p.is_active = true
        AND u.is_active = true
        AND s.is_active = true
      ORDER BY u.name ASC
    `,
    [companyId]
  );

  return result.rows;
}

async function findActiveProfessionalsByCompanyId(companyId) {
  const result = await pool.query(
    `
      SELECT
        p.id,
        u.name
      FROM professionals p
      JOIN users u
        ON u.id = p.user_id
       AND u.company_id = p.company_id
      WHERE
        p.company_id = $1
        AND p.is_active = true
        AND u.is_active = true
      ORDER BY u.name ASC
    `,
    [companyId]
  );

  return result.rows;
}

async function createProfessional({
  companyId,
  userId,
  slug
}) {

  const result = await pool.query(
    `
    INSERT INTO professionals (
      company_id,
      user_id,
      slug
    )
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [companyId, userId, slug]
  );

  return result.rows[0];
}

module.exports = {
  findProfessionalById,
  findProfessionalByUserId,
  findActiveProfessionalsPublicByCompanyId,
  findActiveProfessionalsByCompanyId,
  createProfessional
};