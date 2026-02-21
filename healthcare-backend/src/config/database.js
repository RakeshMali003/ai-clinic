const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    // console.debug('✅ DB Connected'); // Optional logging
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
});

module.exports = pool;
