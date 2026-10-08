export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} was not found` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.status || 500;
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'An unexpected server error occurred'
    : error.message || 'An unexpected server error occurred';
  res.status(status).json({ message });
}
