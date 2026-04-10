const { findActiveClientsByCompany } = require('../database/clients.repository');

async function list(req, res, next) {
  try {
    const companyId = req.user.companyId;

    const clients = await findActiveClientsByCompany(companyId);

    return res.status(200).json({ clients });
  } catch (error) {
    next(error);
  }
}

const { findClientByPhone } = require('../database/clients.repository');
const pool = require('../database/db'); // ou onde você busca company

async function getByPhone(req, res, next) {
  try {
    const { slug } = req.params;
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }

    // 🔥 BUSCAR COMPANY PELO SLUG
    const companyResult = await pool.query(
      `SELECT id FROM companies WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    const companyId = companyResult.rows[0].id;

    const client = await findClientByPhone({
      companyId,
      phone
    });

    if (!client) {
      return res.status(200).json(null);
    }

    return res.status(200).json({
      name: client.name,
      phone: client.phone
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getByPhone
};