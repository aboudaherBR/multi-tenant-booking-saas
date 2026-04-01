const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 🔴 Validação básica do header
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Formato do token inválido' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    // 🔴 Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 PADRONIZAÇÃO GLOBAL DO USER (CONTRATO ÚNICO)
    req.user = {
      id: decoded.userId,                // padrão principal
      userId: decoded.userId,            // compatibilidade
      companyId: decoded.companyId,
      isProfessional: decoded.isProfessional,
      isCompanyAdmin: decoded.isCompanyAdmin,
      isSuperAdmin: decoded.isSuperAdmin
    };

    return next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = {
  requireAuth: authMiddleware
};