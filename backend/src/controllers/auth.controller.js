const { authenticate, authenticateWithCompany } = require('../services/auth.service');
const { findProfessionalByUserId } = require('../database/professionals.repository');
const { createCompany, findCompanyBySlug } = require('../database/companies.repository');
const jwt = require('jsonwebtoken');
const slugify = require('../utils/slugify');

async function login(req, res, next) {
  try {
    const { slug, username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    let user;

    if (slug) {
      const company = await findCompanyBySlug(slug);

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

    const professional = user.company_id
      ? await findProfessionalByUserId({
          userId: user.id,
          companyId: user.company_id
        })
      : null;

    console.log('LOGIN DEBUG - PROFESSIONAL LOOKUP:', {
      userId: user.id,
      companyId: user.company_id,
      found: !!professional
    });

    const payload = {
      userId: user.id,
      name: user.name,
      companyId: user.company_id,
      isCompanyAdmin: user.is_company_admin,
      isProfessional: Boolean(professional),
      isSuperAdmin: user.company_id === null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '10s'
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
  try {
    const { salonName, name, phone, password } = req.body;

    if (!salonName || !name || !phone || !password) {
      return res.status(400).json({
        message: "Dados obrigatórios faltando"
      });
    }

    const slug = slugify(salonName);

    console.log("SLUG GERADO:", slug);

    const existingCompany = await findCompanyBySlug(slug);
    console.log("SLUG EXISTE?", !!existingCompany);

    const companyData = {
      name: salonName,
      slug: slug
    };

    console.log("COMPANY DATA:", companyData);

    const company = await createCompany(companyData);

    console.log("COMPANY CRIADA:", company);

    return res.json({
      message: "Payload válido",
      salonName,
      name,
      phone
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error.message);

    return res.status(500).json({
      message: "Erro ao criar conta"
    });
  }
}

module.exports = {
  login,
  signup
};