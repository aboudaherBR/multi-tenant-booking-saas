function errorMiddleware(err, req, res, next) {
  // Erros de domínio (regras de negócio violadas)
  return res.status(400).json({
    error: err.message
  });
}

module.exports = errorMiddleware;
