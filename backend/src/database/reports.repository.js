const pool = require('./db');


async function getSummary({
    companyId,
    startDate,
    endDate,
    professionalId,
    serviceId
}) {

    let query = `
    SELECT
      COUNT(*) AS total_services,
      COALESCE(SUM(service_price_snapshot),0) AS total_revenue,
      COALESCE(AVG(service_price_snapshot),0) AS ticket_average
    FROM appointments
    WHERE company_id = $1
      AND date BETWEEN $2 AND $3
  `;

    const params = [companyId, startDate, endDate];
    let paramIndex = 4;

    if (professionalId) {
        query += ` AND professional_id = $${paramIndex}`;
        params.push(professionalId);
        paramIndex++;
    }

    if (serviceId) {
        query += ` AND service_id = $${paramIndex}`;
        params.push(serviceId);
        paramIndex++;
    }

    const result = await pool.query(query, params);

    return result.rows[0];
}

module.exports = {
    getSummary
};

module.exports = {
    getSummary
};