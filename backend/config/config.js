// We must load dotenv here to read the .env file
require('dotenv').config();

// Validate essential environment variables
if (!process.env.DB_URI) {
    throw new Error('FATAL ERROR: DB_URI is not defined in .env file');
}
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in .env file');
}
if (!process.env.ENCRYPTION_KEY) {
    throw new Error('FATAL ERROR: ENCRYPTION_KEY is not defined in .env file');
}

module.exports = {
    dbURI: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY
};
