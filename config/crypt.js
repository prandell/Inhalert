const crypto = require('crypto');

//credit https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
/**
 * Encryption of passwords used WITHIN repository for Nodemailer account
 * ENCRYPTION_KEY: Must be 256 bits (32 characters). Generated with "randomstring 32" cmd line
 * IV_LENGTH: For AES (Hash method), this is always 16
 */
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

/**
 * Encrypts supplied text.
 * Args:
 *  text: String to encrypt
 * Returns:
 *  encrypted string
 */
function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * decrypts supplied text.
 * Args:
 *  text: String to decrypt
 * Returns:
 *  decrypted text
 */
function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;