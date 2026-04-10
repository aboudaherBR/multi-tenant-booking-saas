const pool = require("./db");


async function findProfessionalServiceLink(companyId, professionalId, serviceId) {

  const result = await pool.query(
    `
    SELECT 1
    FROM professional_services
    WHERE company_id = $1
      AND professional_id = $2
      AND service_id = $3
    LIMIT 1
    `,
    [companyId, professionalId, serviceId]
  );

  return result.rows[0] || null;

}


async function listServicesForProfessional(companyId, professionalId) {

  const result = await pool.query(
    `
    SELECT 
      s.id,
      s.name,
      s.duration_minutes,
      COALESCE(ps.custom_price, s.base_price) AS price
    FROM services s
    JOIN professional_services ps
      ON ps.service_id = s.id
    WHERE ps.professional_id = $1
      AND ps.company_id = $2
      AND s.is_active = true
    `,
    [professionalId, companyId]
  );

  return result.rows;

}


async function addServiceToProfessional(companyId, professionalId, serviceId, customPrice) {
  console.log('CUSTOM PRICE RECEBIDO:', customPrice);
  const result = await pool.query(
    `
    INSERT INTO professional_services (
      company_id,
      professional_id,
      service_id,
      custom_price
    )
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (company_id, professional_id, service_id)
    DO UPDATE
      SET custom_price = EXCLUDED.custom_price
    RETURNING *
    `,
    [companyId, professionalId, serviceId, customPrice || null]
  );

  return result.rows[0];

}


async function removeServiceFromProfessional(companyId, professionalId, serviceId) {

  await pool.query(
    `
    DELETE FROM professional_services
    WHERE company_id = $1
      AND professional_id = $2
      AND service_id = $3
    `,
    [companyId, professionalId, serviceId]
  );

}


module.exports = {
  findProfessionalServiceLink,
  listServicesForProfessional,
  addServiceToProfessional,
  removeServiceFromProfessional
};