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
  console.log("USANDO findActiveProfessionalsPublicByCompanyId");
  const result = await pool.query(
    
    `
     SELECT DISTINCT ON (p.id)
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
      ORDER BY 
        p.id,
        p.photo_url DESC,
        u.name ASC;
    `,
    [companyId]
  );

  return result.rows;
}

async function findActiveProfessionalsByCompanyId(companyId) {
  console.log("USANDO findActiveProfessionalsByCompanyId");
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.photo_url,
        p.slug,
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

async function findActiveProfessionalsWithPreviewByCompanyId(companyId) {
  const result = await pool.query(
    `
    SELECT 
      p.id,
      p.photo_url,
      p.slug,
      u.name,

      CASE 
        WHEN COUNT(*) > 3 THEN 
          STRING_AGG(sub.name, ' • ' ORDER BY sub.name) 
            FILTER (WHERE sub.rn <= 5)
          || ' • +' || (COUNT(*) - 5)
        ELSE 
          STRING_AGG(sub.name, ' • ' ORDER BY sub.name)
      END AS services_preview

    FROM (
      SELECT 
        p.id,
        p.company_id,
        p.user_id,
        s.name,
        ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.name) AS rn
      FROM professionals p
      JOIN users u
        ON u.id = p.user_id
       AND u.company_id = p.company_id
      JOIN professional_services ps
        ON ps.professional_id = p.id
       AND ps.company_id = p.company_id
      JOIN services s
        ON s.id = ps.service_id
       AND s.company_id = ps.company_id
      WHERE
        p.company_id = $1
        AND p.is_active = true
        AND u.is_active = true
        AND s.is_active = true
    ) sub

    JOIN professionals p ON p.id = sub.id
    JOIN users u 
      ON u.id = p.user_id
     AND u.company_id = p.company_id

    GROUP BY p.id, p.photo_url, p.slug, u.name
    ORDER BY u.name ASC;
    `,
    [companyId]
  );

  return result.rows;
}

module.exports = {
  findProfessionalById,
  findProfessionalByUserId,
  findActiveProfessionalsPublicByCompanyId,
  findActiveProfessionalsByCompanyId,
  createProfessional,
  findActiveProfessionalsWithPreviewByCompanyId
};