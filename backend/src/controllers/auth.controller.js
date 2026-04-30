const { authenticate, authenticateWithCompany } = require('../services/auth.service');
const { findProfessionalByUserId, createProfessional } = require('../database/professionals.repository');
const { createCompany, findCompanyBySlug } = require('../database/companies.repository');
const generateUniqueSlug = require('../utils/generateUniqueSlug');
const jwt = require('jsonwebtoken');
const slugify = require('../utils/slugify');
const bcrypt = require('bcrypt');
const { createUser, findByUsernameAndCompany } = require('../database/users.repository');
const pool = require('../database/db');

async function login(req, res, next) {

  try {
    const { slug, username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    let user;

    if (slug) {
      const company = await findCompanyBySlug(slug);
      console.log("COMPANY LOGIN:", company);

      console.log('LOGIN DEBUG - COMPANY LOOKUP:', {
        slug,
        companyId: company?.id,
        username
      });

      if (!company) {
        throw new Error('Invalid credentials');
      }

      user = await authenticateWithCompany(username, password, company.id);
    } else {
      user = await authenticate(username, password);
    }

    // 🔥 DEBUG TEMPORÁRIO
    if (user.company_id) {
      const result = await pool.query(
        'SELECT slug FROM companies WHERE id = $1',
        [user.company_id]
      );

      console.log('DEBUG COMPANY SLUG:', result.rows[0]);
    }

    const professional = user.company_id
      ? await findProfessionalByUserId({
        userId: user.id,
        companyId: user.company_id
      })
      : null;

    const payload = {
      userId: user.id,
      name: user.name,
      companyId: user.company_id,
      isCompanyAdmin: user.is_company_admin,
      isProfessional: Boolean(professional),
      isSuperAdmin: user.company_id === null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '12h'
    });

    return res.json({
      message: 'Login successful',
      token
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error.message);

    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }
}

async function signup(req, res) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      salonName,
      companyPhone,
      name,
      username,
      password,
      address_street,
      address_number,
      address_neighborhood,
      address_city,
      address_state
    } = req.body;

    if (!salonName || !companyPhone || !name || !username || !password) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: "Dados obrigatórios faltando"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const baseSlug = slugify(salonName);
    const slug = await generateUniqueSlug(baseSlug);

    const companyData = {
      name: salonName,
      slug: slug,
      phone: companyPhone,
      seller_name: "Sistema",
      address_street,
      address_number,
      address_neighborhood,
      address_city,
      address_state
    };

    const company = await createCompany(companyData, client);

    const existingUser = await findByUsernameAndCompany(
      username,
      company.id,
      client
    );

    if (existingUser) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: "Username já existe neste salão"
      });
    }

    const user = await createUser({
      companyId: company.id,
      name,
      username,
      passwordHash,
      isCompanyAdmin: true
    }, client);

    const professionalSlug = slugify(name);

    const professional = await createProfessional({
      companyId: company.id,
      userId: user.id,
      slug: professionalSlug
    }, client);

    const payload = {
      userId: user.id,
      name: user.name,
      companyId: user.company_id,
      companySlug: result.rows[0]?.slug, // 🔥 ADICIONA ISSO
      isCompanyAdmin: user.is_company_admin,
      isProfessional: Boolean(professional),
      isSuperAdmin: user.company_id === null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    await client.query('COMMIT');

    return res.json({
      message: "Signup realizado com sucesso",
      token
    });

  } catch (error) {
    await client.query('ROLLBACK');

    console.error("SIGNUP ERROR COMPLETO:");
    console.error(error);

    return res.status(500).json({
      message: error.message,
      detail: error.detail,
      stack: error.stack
    });
  } finally {
    client.release();
  }
}

module.exports = {
  login,
  signup
};