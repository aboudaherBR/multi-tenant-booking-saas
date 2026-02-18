const { authenticate } = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await authenticate(username, password);

    req.session.user = {
      userId: user.id,
      companyId: user.company_id,
      isCompanyAdmin: user.is_company_admin,
      isProfessional: user.is_professional,
      isSuperAdmin: user.company_id === null
    };

    return res.json({ message: 'Login successful' });

  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

module.exports = {
  login
};
