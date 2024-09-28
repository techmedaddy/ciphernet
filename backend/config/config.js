// File: backend/config/config.js
module.exports = {
    dbURI: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY
  };
  