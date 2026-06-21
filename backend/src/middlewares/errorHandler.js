const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const response = {
    success: false,
    message: err.message || 'Erro interno do servidor',
  };

  if (!isProduction && statusCode === 500) {
    response.stack = err.stack;
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
