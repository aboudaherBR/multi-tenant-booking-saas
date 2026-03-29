const { authenticate, authenticateWithCompany } = require('../services/auth.service');
const { findProfessionalByUserId } = require('../database/professionals.repository');
const { findCompanyBySlug } = require('../database/companies.repository');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
  try {
    const { slug, username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    let user;

    if (slug) {
      const company = await findCompanyBySlug(slug);

      console.log({
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

    const professional = user.company_id
      ? await findProfessionalByUserId({
        userId: user.id,
        companyId: user.company_id
      })
      : null;

    // 🔥 LOG PRA DEBUG (MUITO IMPORTANTE)
    console.log('USER:', user);
    console.log('PROFESSIONAL:', professional);

    const payload = {
      userId: user.id,
      name: user.name,
      companyId: user.company_id,
      isCompanyAdmin: user.is_company_admin,

      // 🔥 CORREÇÃO AQUI
      isProfessional: Boolean(professional) || user.is_professional === true,

      isSuperAdmin: user.company_id === null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    return res.json({
      message: 'Login successful',
      token
    });

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }
}

module.exports = {
  login
};