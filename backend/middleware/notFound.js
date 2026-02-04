const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      services: '/api/services',
      bookings: '/api/bookings',
      payments: '/api/payments',
      upload: '/api/upload',
      admin: '/api/admin'
    }
  });
};

module.exports = notFound;