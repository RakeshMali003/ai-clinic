const app = require('./src/app');
const config = require('./src/config/env');
const pool = require('./src/config/database');

const PORT = config.port;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${config.env} mode on port ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down...');
    server.close(() => {
        pool.end();
        console.log('Process terminated.');
    });
});
