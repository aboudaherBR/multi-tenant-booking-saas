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
        p.phone,
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

async function createProfessional(
  {
    companyId,
    userId,
    slug
  },
  client = pool
) {

  const result = await client.query(
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
    WHEN total.total_services > 5 THEN 
      preview.preview_names || ' • +' || (total.total_services - 5)
    ELSE 
      preview.preview_names
  END AS services_preview

FROM professionals p

JOIN users u
  ON u.id = p.user_id
 AND u.company_id = p.company_id

JOIN (
  SELECT 
    p.id,
    COUNT(*) AS total_services
  FROM professionals p
  JOIN professional_services ps
    ON ps.professional_id = p.id
   AND ps.company_id = p.company_id
  JOIN services s
    ON s.id = ps.service_id
   AND s.company_id = ps.company_id
  WHERE 
    p.company_id = $1
    AND p.is_active = true
    AND s.is_active = true
  GROUP BY p.id
) total ON total.id = p.id

JOIN (
  SELECT 
    sub.id,
    STRING_AGG(sub.name, ' • ' ORDER BY sub.name) AS preview_names
  FROM (
    SELECT 
      p.id,
      s.name,
      ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.name) AS rn
    FROM professionals p
    JOIN professional_services ps
      ON ps.professional_id = p.id
     AND ps.company_id = p.company_id
    JOIN services s
      ON s.id = ps.service_id
     AND s.company_id = ps.company_id
    WHERE 
      p.company_id = $1
      AND p.is_active = true
      AND s.is_active = true
  ) sub
  WHERE sub.rn <= 5
  GROUP BY sub.id
) preview ON preview.id = p.id

WHERE p.company_id = $1
ORDER BY u.name;
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