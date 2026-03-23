function getCurrentSession(req, res) {

  // 🔥 CORREÇÃO (JWT)
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json(req.user);
}

module.exports = {
  getCurrentSession
};