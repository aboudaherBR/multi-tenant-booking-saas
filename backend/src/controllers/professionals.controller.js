const bcrypt = require('bcrypt');
const pool = require('../database/db');

const {
  findActiveProfessionalsByCompanyId,
  findActiveProfessionalsPublicByCompanyId,
  createProfessional
} = require('../database/professionals.repository');

const {
  findActiveServicesPublicByProfessionalSlug
} = require('../database/services.repository');

const {
  createUser
} = require('../database/users.repository');

const { findCompanyBySlug } = require('../database/companies.repository');


async function list(req, res, next) {
  try {

    const companyId = req.session.user.companyId;

    const professionals =
      await findActiveProfessionalsByCompanyId(companyId);

    return res.status(200).json(professionals);

  } catch (error) {
    next(error);
  }
}


async function create(req, res, next) {
  try {

    const { name, password } = req.body;
    const companyId = req.session.user.companyId;

    if (!name || !password) {
      return res.status(400).json({
        message: 'name e password são obrigatórios'
      });
    }

    const username = name.trim();

    const slug =
      username
        .toLowerCase()
        .replace(/\s+/g, '-') +
      '-' +
      Date.now().toString().slice(-6);

    const passwordHash = await bcrypt.hash(password, 10);

    const client = await pool.connect();

    try {

      await client.query('BEGIN');

      // criar user
      const userResult = await client.query(
        `
        INSERT INTO users (
          company_id,
          name,
          username,
          password_hash,
          is_company_admin
        )
        VALUES ($1, $2, $3, $4, false)
        RETURNING id
        `,
        [companyId, name, username, passwordHash]
      );

      const userId = userResult.rows[0].id;

      // criar professional
      const professionalResult = await client.query(
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

      await client.query('COMMIT');

      return res.status(201).json({
        id: professionalResult.rows[0].id,
        name
      });

    } catch (error) {

      await client.query('ROLLBACK');
      throw error;

    } finally {

      client.release();

    }

  } catch (error) {
    next(error);
  }
}


async function listPublic(req, res, next) {
  try {

    const { companySlug } = req.params;

    const company = await findCompanyBySlug(companySlug);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada'
      });
    }

    const companyId = company.id;

    const professionals =
      await findActiveProfessionalsPublicByCompanyId(companyId);

    return res.status(200).json(professionals);

  } catch (error) {
    next(error);
  }
}


async function listServicesPublic(req, res, next) {
  try {

    const { companySlug, slug } = req.params;

    const company = await findCompanyBySlug(companySlug);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada'
      });
    }

    const companyId = company.id;

    const services =
      await findActiveServicesPublicByProfessionalSlug({
        companyId,
        professionalSlug: slug
      });

    return res.status(200).json(services);

  } catch (error) {
    next(error);
  }
}


module.exports = {
  list,
  create,
  listPublic,
  listServicesPublic
};