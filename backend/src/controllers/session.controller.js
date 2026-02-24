function getCurrentSession(req, res) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json(req.session.user);
}

module.exports = {
  getCurrentSession
};