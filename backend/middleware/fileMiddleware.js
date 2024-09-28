// File: backend/middleware/fileMiddleware.js
module.exports = (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    next();
  };
  