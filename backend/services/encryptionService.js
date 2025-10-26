const crypto = require('crypto');
const { encryptionKey } = require('../config/config');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_BYTES = 32;

let key;
try {
    key = Buffer.from(encryptionKey, 'hex');
    if (key.length !== KEY_BYTES) {
        throw new Error('Invalid ENCRYPTION_KEY length. Must be a 64-character hex string (32 bytes).');
    }
} catch (error) {
    console.error(`FATAL ERROR: Failed to load ENCRYPTION_KEY. ${error.message}`);
    process.exit(1);
}

exports.encryptData = (data) => {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        
        const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();

        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Could not encrypt data.');
    }
};

exports.decryptData = (encryptedData) => {
    try {
        const parts = encryptedData.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted data format.');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encrypted = Buffer.from(parts[2], 'hex');

        if (iv.length !== IV_LENGTH) {
            throw new Error('Invalid IV length.');
        }
        if (authTag.length !== AUTH_TAG_LENGTH) {
            throw new Error('Invalid auth tag length.');
        }

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        return decrypted.toString('utf8');
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Could not decrypt data. Data may be tampered or key is incorrect.');
    }
};
