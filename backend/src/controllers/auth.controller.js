const { authenticate } = require('../services/auth.service');
const { findProfessionalByUserId } = require('../database/professionals.repository');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
  try {
    console.log('BODY RECEIVED:', req.body);

    const { slug, username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    let user;

    if (slug) {
      const { findCompanyBySlug } = require('../database/companies.repository');
      const { authenticateWithCompany } = require('../services/auth.service');

      const company = await findCompanyBySlug(slug);

      if (!company) {
        throw new Error('Invalid credentials');
      }

      user = await authenticateWithCompany(username, password, company.id);
    } else {
      user = await authenticate(username, password);
    }

    const professional = user.company_id
      ? await findProfessionalByUserId(user.company_id, user.id)
      : null;

    // 🔥 CRIA PAYLOAD COMPLETO
    const payload = {
      userId: user.id,
      name: user.name,
      companyId: user.company_id,
      isCompanyAdmin: user.is_company_admin,
      isProfessional: Boolean(professional),
      isSuperAdmin: user.company_id === null
    };

    // 🔥 GERA TOKEN
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    return res.json({
      message: 'Login successful',
      token
    });

  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

module.exports = {
  login
};