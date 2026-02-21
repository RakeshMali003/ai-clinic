const path = require('path');
const dotenv = require('dotenv');

// Load .env from root of healthcare-backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true'
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expire: process.env.JWT_EXPIRE || '7d'
    },
    upload: {
        path: process.env.UPLOAD_PATH || './uploads',
        maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*'
    }
};
