const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-256-bit-secret';

module.exports = {
    encrypt: (data) => {
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, { 
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return {
            iv: iv.toString(),
            content: encrypted.toString()
        };
    },
    decrypt: (encryptedData) => {
        const bytes = CryptoJS.AES.decrypt(
            encryptedData.content,
            SECRET_KEY,
            { iv: CryptoJS.enc.Hex.parse(encryptedData.iv) }
        );
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
};
