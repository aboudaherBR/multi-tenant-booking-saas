const pool = require('./db');

async function findServiceById({ companyId, serviceId }) {
  const result = await pool.query(
    `
      SELECT id,
             name,
             base_price,
             duration_minutes
      FROM services
      WHERE company_id = $1
        AND id = $2
        AND is_active = true
    `,
    [companyId, serviceId]
  );

  return result.rows[0] || null;
}

async function findServiceForProfessional({
  companyId,
  professionalId,
  serviceId
}) {
  const result = await pool.query(
    `
      SELECT
        s.id,
        s.name,
        s.duration_minutes,
        COALESCE(ps.custom_price, s.base_price) AS final_price
      FROM professional_services ps
      JOIN services s
        ON s.id = ps.service_id
       AND s.company_id = ps.company_id
      WHERE ps.company_id = $1
        AND ps.professional_id = $2
        AND ps.service_id = $3
        AND s.is_active = true
      LIMIT 1
    `,
    [companyId, professionalId, serviceId]
  );

  return result.rows[0] || null;
}

async function listServicesForProfessional({
  companyId,
  professionalId
}) {
  const result = await pool.query(
    `
      SELECT
        s.id,
        s.name,
        s.duration_minutes,
        COALESCE(ps.custom_price, s.base_price) AS price
      FROM professional_services ps
      JOIN services s
        ON s.id = ps.service_id
       AND s.company_id = ps.company_id
      WHERE ps.company_id = $1
        AND ps.professional_id = $2
        AND s.is_active = true
      ORDER BY s.name ASC
    `,
    [companyId, professionalId]
  );

  return result.rows;
}

/**
 * 🔓 Público (lista serviços)
 */
async function findActiveServicesPublicByProfessionalSlug({
  companyId,
  professionalSlug
}) {
  const result = await pool.query(
    `
      SELECT
        s.slug,
        s.name,
        s.duration_minutes,
        COALESCE(ps.custom_price, s.base_price) AS price
      FROM professionals p
      JOIN professional_services ps
        ON ps.professional_id = p.id
       AND ps.company_id = p.company_id
      JOIN services s
        ON s.id = ps.service_id
       AND s.company_id = p.company_id
      WHERE
        p.company_id = $1
        AND p.slug = $2
        AND p.is_active = true
        AND s.is_active = true
      ORDER BY s.name ASC
    `,
    [companyId, professionalSlug]
  );

  return result.rows;
}

/**
 * 🔥 CORREÇÃO CRÍTICA AQUI
 */
async function findServiceForProfessionalBySlugs({
  companyId,
  professionalSlug,
  serviceSlug
}) {
  const result = await pool.query(
    `
      SELECT
        s.id, -- 🔥 ESSENCIAL
        s.name, -- 🔥 SNAPSHOT
        COALESCE(ps.custom_price, s.base_price) AS price, -- 🔥 SNAPSHOT
        s.duration_minutes,
        p.id AS professional_id
      FROM professionals p
      JOIN professional_services ps
        ON ps.professional_id = p.id
       AND ps.company_id = p.company_id
      JOIN services s
        ON s.id = ps.service_id
       AND s.company_id = p.company_id
      WHERE
        p.company_id = $1
        AND p.slug = $2
        AND p.is_active = true
        AND s.slug = $3
        AND s.is_active = true
      LIMIT 1
    `,
    [companyId, professionalSlug, serviceSlug]
  );

  return result.rows[0] || null;
}

module.exports = {
  findServiceById,
  findServiceForProfessional,
  listServicesForProfessional,
  findActiveServicesPublicByProfessionalSlug,
  findServiceForProfessionalBySlugs
};