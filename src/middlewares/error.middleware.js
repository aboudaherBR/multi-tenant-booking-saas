function errorMiddleware(err, req, res, next) {
  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Este horário acabou de ser reservado. Escolha outro horário.'
    });
  }

  const status = err.status || 500;

  return res.status(status).json({
    error: err.message
  });
}

module.exports = errorMiddleware;